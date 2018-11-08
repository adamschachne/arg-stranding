const FastPriorityQueue = require("fastpriorityqueue");

// takes array of urlItems and sorts by time
// TODO reduce this data to only necessary parts
module.exports = function sortData(urls) {
  const pqueue = new FastPriorityQueue(((a, b) => {
    if (a.lastModifiedUnix && !b.lastModifiedUnix) {
      return true;
    }
    return a.lastModifiedUnix < b.lastModifiedUnix;
  }));

  for (let i = 0; i < urls.length; i += 1) {
    pqueue.add(urls[i]);
  }

  const newUrls = [];
  while (!pqueue.isEmpty()) {
    newUrls.push(pqueue.poll());
  }

  return newUrls;
};
