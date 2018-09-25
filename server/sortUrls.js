const FastPriorityQueue = require("fastpriorityqueue");

// takes array of urlItems and sorts by time
// TODO reduce this data to only necessary parts
module.exports = function sortData(urls) {
  let pqueue = new FastPriorityQueue(function (a, b) {
    if (a.lastModifiedUnix && !b.lastModifiedUnix) {
      return true;
    }
    return a.lastModifiedUnix < b.lastModifiedUnix;
  });

  for (let i = 0; i < urls.length; i++) {
    pqueue.add(urls[i]);
  }

  let newUrls = [];
  while (!pqueue.isEmpty()) {
    newUrls.push(pqueue.poll());
  }

  return newUrls;
}