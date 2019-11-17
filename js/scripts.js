let pokemonRepository = (function() {
  let repository = [];
  let apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";

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
    let $pokemonList = $(".pokemon-list");
    let $listItem = $("<li>");
    let $button = $('<button class="my-class">' + pokemon.name + "</button>");
    $listItem.append($button);
    $pokemonList.append($listItem);
    $button.on("click", function(event) {
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
          let pokemon = {
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
    let url = item.detailsUrl;
    return $.ajax(url)
      .then(function(details) {
        item.imageUrl = details.sprites.front_default;
        item.height = details.height;
        item.types = [];
        for (let i = 0; i < details.types.length; i++) {
          item.types.push(details.types[i].type.name);
        }
      })
      .catch(function(e) {
        console.error(e);
      });
  }

  function showModal(item) {
    let $modalContainer = $("#modal-container");
    $modalContainer.empty();
    let modal = $('<div class="modal"></div>');
    let closeButtonElement = $('<button class="modal-close">Close</button>');
    closeButtonElement.on("click", hideModal);
    let nameElement = $("<h1>" + item.name + "<h1>");
    let imageElement = $('<img src="' + item.imageUrl + '">');
    let heightElement = $("<p>" + "Height: " + item.height + "</p>");
    let typesElement = $("<p>" + "types : " + item.types + "</p>");
    modal.append(closeButtonElement);
    modal.append(nameElement);
    modal.append(imageElement);
    modal.append(heightElement);
    modal.append(typesElement);
    $modalContainer.append(modal);
    $modalContainer.addClass("is-visible");
  }

  function hideModal() {
    let $modalContainer = $("#modal-container");
    $modalContainer.removeClass("is-visible");
  }

  jQuery(window).on("keydown", e => {
    let $modalContainer = $("#modal-container");
    if (e.key === "Escape" && $modalContainer.hasClass("is-visible")) {
      hideModal();
    }
  });

  let $modalContainer = document.querySelector("#modal-container");
  $modalContainer.addEventListener("click", e => {
    let target = e.target;
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
