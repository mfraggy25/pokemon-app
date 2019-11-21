let pokemonRepository = (function() {
  let repository = [];
  let apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";
  //Function to add new Pokemon data
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
  //Function to pull all Pokemon data
  function getAll() {
    return repository;
  }
  //Function to add list for each pokemon object
  function addListItem(pokemon) {
    let $pokemonList = $(".pokemon-list");
    let listItem = $(
      '<button type="button" class="pokemon-list_item list-group-item list-group-item-action" data-toggle="modal" data-target="#exampleModal"></button>'
    );
    // Adds Pokemon name to text within button
    listItem.text(pokemon.name);
    // Adds the 'li' to 'ul' with pokemonList class in index file
    $pokemonList.append(listItem);
    // Calls showDetails function when button is clicked
    listItem.click(function() {
      showDetails(pokemon);
    });
  }
  // Function to show details of each Pokemon
  function showDetails(item) {
    pokemonRepository.loadDetails(item).then(function() {
      console.log(item);
      showModal(item);
    });
  }
  //Function to load pokemon list from API
  function loadList() {
    return $.ajax(apiUrl)
      .then(function(json) {
        json.results.forEach(function(item) {
          let pokemon = {
            name: item.name.charAt(0).toUpperCase() + item.name.slice(1),
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
        // Now we add the details to the item
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
    let modalBody = $(".modal-body");
    let modalTitle = $(".modal-title");
    modalTitle.empty();
    modalBody.empty();
    let nameElement = $(".modal-title").text(
      item.name.charAt(0).toUpperCase() + item.name.slice(1)
    );
    let imageElement = $('<img src="' + item.imageUrl + '">');
    imageElement.attr("src", item.imageUrl);
    let heightElement = $("<p>" + "height : " + item.height + "</p>");
    let typesElement = $("<p>" + "types : " + item.types + "</p>");
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

// Add search bar
$(document).ready(function() {
  $("#pokemon-search").on("keyup", function() {
    var value = $(this).val();
    $(".pokemon-list_item").filter(function() {
      $(this).toggle(
        $(this)
          .text()
          .indexOf(value) > -1
      );
    });
  });
});

// forEach Used To cycle through addListItem function properties
pokemonRepository.loadList().then(function() {
  // Now the data is loaded
  pokemonRepository.getAll().forEach(function(pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
