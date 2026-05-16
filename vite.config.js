import { defineConfig } from "vite";
import nunjucks from "nunjucks";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templateDir = path.resolve(__dirname, "src/templates");
const generatedDir = __dirname;

const pages = [
  { name: "index", file: "index.html", title: "IISc Smart Mess &mdash; Home", active: "Home" },
  { name: "menu", file: "menu.html", title: "IISc Smart Mess &mdash; Menu", active: "Menu" },
  { name: "about", file: "about.html", title: "IISc Smart Mess &mdash; Menu & Services", active: "About" },
  { name: "contact", file: "contact.html", title: "IISc Smart Mess &mdash; Contact", active: "Contact" }
];

function renderPages() {
  fs.mkdirSync(generatedDir, { recursive: true });

  const env = new nunjucks.Environment(new nunjucks.FileSystemLoader(templateDir), {
    autoescape: false,
    noCache: true
  });

  for (const page of pages) {
    const html = env.render(`pages/${page.name}.njk`, {
      ...page,
      pages
    });
    fs.writeFileSync(path.join(generatedDir, page.file), html);
  }
}

function nunjucksPagesPlugin() {
  return {
    name: "nunjucks-pages",
    buildStart() {
      renderPages();
    },
    configureServer(server) {
      renderPages();
      server.watcher.add(path.resolve(templateDir, "**/*.njk"));
      server.watcher.on("change", (file) => {
        if (file.endsWith(".njk")) {
          renderPages();
          server.ws.send({ type: "full-reload" });
        }
      });
      server.middlewares.use(async (req, res, next) => {
        const url = req.url === "/" ? "/index.html" : req.url;
        const page = pages.find((item) => `/${item.file}` === url);
        if (!page) {
          next();
          return;
        }

        const htmlPath = path.join(generatedDir, page.file);
        const html = fs.readFileSync(htmlPath, "utf-8");
        const transformed = await server.transformIndexHtml(url, html);
        res.setHeader("Content-Type", "text/html");
        res.end(transformed);
      });
    }
  };
}

export default defineConfig({
  base: "./",
  plugins: [nunjucksPagesPlugin()],
  root: __dirname,
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
    rollupOptions: {
      input: Object.fromEntries(
        pages.map((page) => [page.name, path.join(generatedDir, page.file)])
      )
    }
  },
  server: {
    open: "/index.html"
  }
});
