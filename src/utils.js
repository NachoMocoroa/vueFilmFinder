export const utils = {
  searchHTTP: url => {
    return new Promise(function(resolve, reject) {
      let req = new XMLHttpRequest();
      req.open('GET', url);
      req.onload = function() {
        (req.status == 200) ? resolve(req.response) : reject(Error(req.statusText));
      };
      req.onerror = function() {
        reject(Error("Network Error"));
      };
      req.send();
    });
  }
};
