var pokemonRepository = (function() {
  var repository = [];
  var apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";
  function add(pokemon) {
    if (
      typeof pokemon === "object" &&
      "name" in pokemon &&
      "detailsUrl" in pokemon
    ) {
      repository.push(pokemon);
    } else {
      console.log("add an object");
    }
  }
  function getAll() {
    return repository;
  }
  function addListItem(pokemon) {
    var $listItem = $("<li></li>");
    $pokemonList.append($listItem);
    var $button = $(
      '<button type="button" id="pokemon-button" class="btn btn-outline-light" data-toggle="modal" data-target="#exampleModalCenter">' +
        pokemon.name +
        "</button>"
    );
    $listItem.append($button);
    $button.on("click", function() {
      showDetails(pokemon);
    });
  }

  function showDetails(item) {
    pokemonRepository.loadDetails(item).then(function() {
      console.log(item);
      showModal(item);
    });
  }
  function loadList() {
    return $.ajax(apiUrl)
      .then(function(json) {
        json.results.forEach(function(item) {
          var pokemon = {
            name: item.name,
            detailsUrl: item.url
          };
          add(pokemon);
          console.log(pokemon);
        });
      })
      .catch(function(e) {
        console.error(e);
      });
  }

  function loadDetails(item) {
    var url = item.detailsUrl;
    return $.ajax(url)
      .then(function(details) {
        item.imageUrl = details.sprites.front_default;
        item.height = details.height;
        item.types = [];
        for (var i = 0; i < details.types.length; i++) {
          item.types.push(details.types[i].type.name);
        }
      })
      .catch(function(e) {
        console.error(e);
      });
  }

  function showModal(item) {
    var modalBody = $(".modal-body");
    var modalTitle = $(".modal-title");
    modalTitle.empty();
    modalBody.empty();
    var nameElement = $("<h1>" + item.name + "</h1>");
    var imageElement = $('<img src="' + item.imageUrl + '">');
    $("div.pokemon-img").html($imageElement);
    var heightElement = $("<p>" + "height : " + item.height + "</p>");
    var typesElement = $("<p>" + "types : " + item.types + "</p>");
    modalTitle.append(nameElement);
    modalBody.append(imageElement);
    modalBody.append(heightElement);
    modalBody.append(typesElement);
  }

  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
    showModal: showModal
  };
})();
pokemonRepository.loadList().then(function() {
  pokemonRepository.getAll().forEach(function(pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
