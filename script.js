var initial_background_id = 0;

var initial_links = [
  ["https://www.youtube.com", "Youtube"],
  ["https://www.pornhub.com", "Pornhub"],
  ["http://movie.eroterest.net", "Eroterest"],
  ["https://moneyforward.com", "Moneyforward"],
  ["https://www.github.com", "Github"],
  ["https://www.inbox.google.com", "Inbox"],
  ["https://www.i-skylark.com/login.aspx", "Skylark"],
  ["http://www.kuronekoyamato.co.jp/webservice_guide/sai_off.html", "Yamato"],
  ["https://trackings.post.japanpost.jp/delivery/deli/", "Japan Post"],
  ["https://www.e-service.sagawa-exp.co.jp/e/f.d", "Sagawa"],
  ["http://www.bbc.co.uk/", "BBC"]
];
var initial_backgrounds = [
  "url(bg/bg1.jpg)",
  "url(bg/bg2.jpg)",
  "url(bg/bg3.jpg)",
  "url(bg/bg4.jpg)",
  "url(bg/bg5.jpg)",
  "url(bg/bg6.jpg)",
  "url(bg/bg7.jpg)",
  "url(bg/bg8.jpg)",
  "url(bg/bg9.jpg)",
  "url(bg/bg10.jpg)",
  "url(bg/bg11.jpg)",
  "url(bg/bg12.jpg)",
  "url(bg/bg13.jpg)",
  "url(bg/bg14.jpg)",
  "url(bg/bg15.jpg)",
  "url(bg/bg16.jpg)",
  "url(bg/bg17.jpg)"
];

var Foo = {
    template: '#bg-template'
}

var router = new VueRouter();
router.map({
    '/bg': {
        component: Foo
    }
});

var App = {
  el: '#app',
  data: {
    background_id: 0,
    links: [],
    backgrounds: [],
    processing: false,
    popup: false
  },
  methods: {
    prevBackground: function () {
      this.setBackgroundId((this.background_id + this.backgrounds.length - 1) % this.backgrounds.length);
    },
    nextBackground: function () {
      this.setBackgroundId((this.background_id + 1) % this.backgrounds.length);
    },
    setBackgroundId: function (i) {
      this.background_id = i;
      chrome.storage.local.set({"background_id": i});
    },
    removeBackgroundById: function (i) {
      if(window.confirm('Are you sure to remove?')){
        this.backgrounds.splice(i, 1);
        chrome.storage.local.set({"backgrounds": this.backgrounds});
        this.setBackgroundId(this.background_id % this.backgrounds.length);
      }
    },
    addBackground: function (e) {
      e.preventDefault();
      var files = e.target.files;
      var reader = new FileReader();
      reader.onload = function (e) {
        app.backgrounds.push("url(" + e.target.result + ")");
        app.$set("backgrounds", app.backgrounds);
        chrome.storage.local.set({"backgrounds": app.backgrounds});
        app.setBackgroundId(app.backgrounds.length - 1);
      }
      reader.readAsDataURL(files[0]);
    }
  }
};

var app = undefined;

router.start(App, '#app', function () {
  app = router.app;

  // load links
  chrome.storage.local.get("links", function (get) {
    if (get.links === undefined) {
      chrome.storage.local.set({"links": initial_links});
      app.$set("links", initial_links);
    } else {
      app.$set("links", get.links);
    }
  });

  // load backgrounds
  chrome.storage.local.get("backgrounds", function (get) {
    if (get.backgrounds === undefined) {
      chrome.storage.local.set({"backgrounds": initial_backgrounds});
      app.$set("backgrounds", initial_backgrounds);
    } else {
      app.$set("backgrounds", get.backgrounds);
    }
  });

  // load background id
  chrome.storage.local.get("background_id", function (get) {
    if (get.background_id === undefined) {
      chrome.storage.local.set({"background_id": initial_background_id});
      app.$set("background_id", initial_background_id);
    } else {
      app.$set("background_id", get.background_id);
    }
  });
});