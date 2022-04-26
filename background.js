/*! InstantDataScraperNext - 2021-01-21 */

chrome.browserAction.onClicked.addListener(function(e){chrome.windows.getCurrent(function(e){parentWindowId=e.id});window.open(chrome.extension.getURL("popup.html?tabid="+encodeURIComponent(e.id)+"&url="+encodeURIComponent(e.url)),"Table Scraper","toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=1,width=720,height=650")});