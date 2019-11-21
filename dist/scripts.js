let pokemonRepository = (function() {
  let t = [],
    e = "https://pokeapi.co/api/v2/pokemon/?limit=150";
  function o(e) {
    "object" == typeof e && "name" in e && "detailsUrl" in e
      ? t.push(e)
      : console.log("add an object");
  }
  function n(t) {
    let e = $(".modal-body"),
      o = $(".modal-title");
    o.empty(), e.empty();
    let n = $(".modal-title").text(
        t.name.charAt(0).toUpperCase() + t.name.slice(1)
      ),
      i = $('<img src="' + t.imageUrl + '">');
    i.attr("src", t.imageUrl);
    let a = $("<p>height : " + t.height + "</p>"),
      l = $("<p>types : " + t.types + "</p>");
    o.append(n), e.append(i), e.append(a), e.append(l);
  }
  return {
    add: o,
    getAll: function() {
      return t;
    },
    addListItem: function(t) {
      let e = $(".pokemon-list"),
        o = $(
          '<button type="button" class="pokemon-list_item list-group-item list-group-item-action" data-toggle="modal" data-target="#exampleModal"></button>'
        );
      o.text(t.name),
        e.append(o),
        o.click(function() {
          var e;
          (e = t),
            pokemonRepository.loadDetails(e).then(function() {
              console.log(e), n(e);
            });
        });
    },
    loadList: function() {
      return $.ajax(e)
        .then(function(t) {
          t.results.forEach(function(t) {
            let e = {
              name: t.name.charAt(0).toUpperCase() + t.name.slice(1),
              detailsUrl: t.url
            };
            o(e), console.log(e);
          });
        })
        .catch(function(t) {
          console.error(t);
        });
    },
    loadDetails: function(t) {
      let e = t.detailsUrl;
      return $.ajax(e)
        .then(function(e) {
          (t.imageUrl = e.sprites.front_default),
            (t.height = e.height),
            (t.types = []);
          for (let o = 0; o < e.types.length; o++)
            t.types.push(e.types[o].type.name);
        })
        .catch(function(t) {
          console.error(t);
        });
    },
    showModal: n
  };
})();
$(document).ready(function() {
  $("#pokemon-search").on("keyup", function() {
    var t = $(this).val();
    $(".pokemon-list_item").filter(function() {
      $(this).toggle(
        $(this)
          .text()
          .indexOf(t) > -1
      );
    });
  });
}),
  pokemonRepository.loadList().then(function() {
    pokemonRepository.getAll().forEach(function(t) {
      pokemonRepository.addListItem(t);
    });
  });
