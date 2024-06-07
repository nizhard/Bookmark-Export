function traverseBookmarks(bookmarkNodes) {
    let bookmarks = [];
    for (let node of bookmarkNodes) {
      if (node.children) {
        bookmarks = bookmarks.concat(traverseBookmarks(node.children));
      } else {
        bookmarks.push({
          title: node.title,
          url: node.url,
        });
      }
    }
    return bookmarks;
  }
  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'downloadBookmarks') {
      chrome.bookmarks.getTree((bookmarkTreeNodes) => {
        let bookmarks = traverseBookmarks(bookmarkTreeNodes);
        let json = JSON.stringify(bookmarks, null, 2);
        let blob = new Blob([json], { type: 'application/json' });
  
        let reader = new FileReader();
        reader.onload = function(event) {
          let base64 = event.target.result;
          chrome.downloads.download({
            url: base64,
            filename: 'bookmarks.json',
            saveAs: true
          });
        };
        reader.readAsDataURL(blob);
      });
    }
  });
  