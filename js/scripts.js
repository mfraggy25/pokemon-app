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
    var $pokemonList = $(".pokemon-list");
    var $listItem = $("<li>");
    var $button = $('<button class="my-class">' + pokemon.name + "</button>");
    $listItem.append($button);
    $pokemonList.append($listItem);
    button.on("click", function(event) {
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
    return $.ajax(apiUrl, { dataType: "json" })
      .then(function(item) {
        $.each(item.results, function(item) {
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
    closeButtonElement.on("click", hideModal);
    var $nameElement = $("h1");
    $nameElement.html(item.name.charAt(0).toUpperCase() + item.name.slice(1));
    var $imageElement = $('<img src="' + item.imageUrl + '">');
    $("div.pokemon-img").html($imageElement);
    var $heightElement = $("div.pokemon-info");
    $heightElement.html("Height: " + item.height);
    var $typesElement = $("div.pokemon-info");
    $typesElement.html("types : " + item.types);
    $modalContainer.append(modal);
    $modalContainer.addClass("is-visible");
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

pokemonRepository.loadList().then(function() {
  pokemonRepository.getAll().forEach(function(pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
