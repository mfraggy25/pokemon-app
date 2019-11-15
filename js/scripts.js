var pokemonRepository = (function() {
  var repository = [];
  var $modalContainer = document.querySelector("#modal-container");
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

  function addListItem(pokemon) {
    var pokemonList = $(".pokemon-list");
    var $listItem = $("<li>");
    var $button = $('<button class="my-class">' + pokemon.name + "</button>");
    $(button).text(pokemon.name);
    $(listitem).append(button);
    button.on("click", function() {
      showDetails(pokemon);
    });
  }

  function showDetails(item) {
    pokemonRepository.loadDetails(item).then(function() {
      showModal(item);
    });
  }
  function add(name) {
    repository.push(name);
  }

  function getAll() {
    return repository;
  }

  function loadList() {
    return $.ajax(apiUrl, { dataType: "json" })
      .then(function(item) {
        $.each(item.results, function(index, item) {
          var pokemon = {
            name: item.name,
            detailsUrl: item.url
          };
          add(pokemon);
        });
      })
      .catch(function(error) {
        document.write(error);
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
    var $modalContainer = $("#modal-container");
    $modalContainer.empty();
    var modal = $('<div class="modal"></div>');
    var closeButtonElement = $('<button class="modal-close">Close</button>');
    $("#Name").text(item.name);
    $("#Img").attr("png", item.imageUrl);
    $("#Height").text(item.artist);
    $("#Types").text(item.typest);
  }

  function hideModal() {
    var $modalContainer = $("#modal-container");
    $modalContainer.removeClass("is-visible");
  }

  jQuery(window).on("keydown", e => {
    var $modalContainer = $("#modal-container");
    if (e.key === "Escape" && $modalContainer.hasClass("is-visible")) {
      hideModal();
    }
  });

  var $modalContainer = document.querySelector("#modal-container");
  $modalContainer.addEventListener("click", e => {
    var target = e.target;
    if (target === $modalContainer) {
      hideModal();
    }
  });

  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
    showModal: showModal,
    hideModal: hideModal
  };
})();

// forEach Used To cycle through addListItem function properties
pokemonRepository.loadList().then(function() {
  // Now the data is loaded
  pokemonRepository.getAll().forEach(function(pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
