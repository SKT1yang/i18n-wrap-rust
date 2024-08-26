//模板下载地址
const config = {
  monorepo: {
    url: "direct:http://192.168.100.157:8081/repository/raw-hosted/vue-monorepo-admin.zip",
    install: "pnpm install",
    bootstrap: "pnpm dev",
  },
  package: {
    url: "direct:http://192.168.100.157:8081/repository/raw-hosted/vue-package-quickstart.zip",
    install: "pnpm install",
    bootstrap: "pnpm dev",
  },
};

export { config };
