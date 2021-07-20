import buildCompiler from "./buildCompiler";

export default function build() {
  const compiler = buildCompiler();
  compiler.run((error, stats) => {
    if (error) {
      console.error(error);
    } else {
      console.log(
        stats?.toString({
          chunks: false,
          colors: true,
        })
      );
    }
    compiler.close((error) => {
      if (error) {
        console.error(error);
      }
    });
  });
}
