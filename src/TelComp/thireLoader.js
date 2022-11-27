/**
 * 第三方资源加载
 */
export default (scriptPath, exportName) =>
  new Promise((resolve, reject) => {
    let script = document.createElement("script");
    script.type = "text/javascript";
    script.src = scriptPath;
    script.onload = (e) => {
      if (!exportName) {
        resolve();
      } else if (exportName instanceof Array) {
        resolve(exportName.map((i) => window[i]));
      } else {
        resolve(window[exportName]);
      }
    };
    document.getElementsByTagName("head")[0].appendChild(script);
  });
