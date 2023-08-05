import { createPeopleTree } from "./family.js";
export var data = {
  people: {
    name: "Ty",
    dateBirth: "",
    dateDeath: "",
    spouse: [
      {
        name: "Twój współmałżonek",
        dateBirth: "",
        dateDeath: "",
        dateWedding: "",
      },
    ],
    children: [
      {
        name: "Twoje dziecko",
        dateBirth: "",
        dateDeath: "",
        spouse: [],
        children: [],
      },
    ],
  },
};
// width of document
let widthElement = $(window).width();
function getPersonData(parent) {
  let Name = parent.find(".name > input").val();
  let DateBirth = parent.find(".date-birth > input").val();
  let DateDeath = parent.find(".date-death > input").val();
  let SpouseName = parent.find(".spouse-name > input").val();
  let SpouseDateBirth = parent.find(".spouse-date-birth > input").val();
  let SpouseDateDeath = parent.find(".spouse-date-death > input").val();
  let SpouseDateWedding = parent.find(".date-wedding > input").val();

  return {
    Name,
    DateBirth,
    DateDeath,
    SpouseName,
    SpouseDateBirth,
    SpouseDateDeath,
    SpouseDateWedding,
  };
}
//************************//
// action on person start //
//************************//
export function actionPerson() {
  let buttonsPersonInfo = [
    `<button type="button" id="AddChildren" class="button-person-option buttons-animation" data-person="child">Dodaj dziecko</button>`,
    `<button type="button" id="AddParents" class="button-person-option buttons-animation" data-person="parents">Dodaj rodziców</button>`,
    `<button type="button" id="AddSpouse" class="button-person-option buttons-animation" data-person="spouse">Dodaj współmałżonka</button>`,
  ];
  let buttonClose = `<i class="close fa-solid fa-circle-xmark"></i>`;
  let buttonRemove = `<div class="trash-container"><i class="trash fa-solid fa-trash-can"></i></div>`;
  let personOption = [
    ["dziecko", "dziecka"],
    ["rodziców", "rodzica", "współmałżonka rodzica"],
    ["współmałżonka", "współmałżonka"],
  ];
  let EditData = '<div class="edit-data"><i class="edit fa-regular fa-pen-to-square"></i><p>Edytuj dane</p></div>';

  let data = d3.select(this)._groups[0][0].__data__;
  const d3This = d3.select(this);
  let tspanLength;
  let buttonsHtml = "";
  if (data.parent === null) {
    if (data.data.spouse.length === 1) {
      buttonsHtml = `${buttonsPersonInfo[0]}${buttonsPersonInfo[1]}`;
      tspanLength = 6;
    } else {
      buttonsHtml = `${buttonsPersonInfo[1]}${buttonsPersonInfo[2]}`;
      tspanLength = 2;
    }
  } else {
    if (data.data.spouse.length === 1) {
      buttonsHtml = `${buttonsPersonInfo[0]}`;
      tspanLength = 6;
    } else {
      buttonsHtml = `${buttonsPersonInfo[2]}`;
      tspanLength = 2;
    }
  }
  $("#PersonInfo")
    .html(
      buttonRemove +
        buttonClose +
        `<div class="person"></div><div class="edit-container">${EditData}<div class="button-save-edit-data"></div></div><div class="buttons">` +
        buttonsHtml +
        "</div>"
    )
    .attr("class", "grid")
    .animate({ left: 0 }, 1000);
  let allInputs = "";
  for (let i = 0; i <= tspanLength; i++) {
    let personContainer = d3This.selectAll("text tspan")._groups[0][i];
    let dataValue = personContainer.parentNode.attributes["data-value"].value;
    let dataLabelText = personContainer.parentNode.attributes["data-labelText"].value;

    allInputs += `
    <div class="data-div ${dataValue}">
      <label>${dataLabelText}</label>
      <input type="text" value="${personContainer.textContent}" disabled>
    </div>`;
  }
  $("#PersonInfo > .person").html(allInputs);

  $(".edit-data").on("click", function () {
    let parent = $(this).parent().parent();
    parent.find("input").removeAttr("disabled");
    parent.find(".buttons").html("<button class='save-data buttons-animation'>Zapisz dane</button>");
    $(".save-data").on("click", function () {
      parent.find("input").attr("disabled", "");
      let personData = getPersonData(parent);
      let newData;
      let parentData = data.parent;
      if (data.data.spouse.length === 0) {
        if (data.parent === null) {
          newData = {
            people: {
              name: personData["Name"],
              dateBirth: personData["DateBirth"],
              dateDeath: personData["DateDeath"],
              spouse: [],
              children: data.data.children,
            },
          };
        } else {
          data.data.name = personData["Name"];
          data.data.dateBirth = personData["DateBirth"];
          data.data.dateDeath = personData["DateDeath"];
          while (parentData !== null && parentData.parent !== null) {
            parentData = parentData.parent;
          }
          newData = {
            people: parentData.data,
          };
        }
      } else {
        if (data.parent === null) {
          newData = {
            people: {
              name: personData["Name"],
              dateBirth: personData["DateBirth"],
              dateDeath: personData["DateDeath"],
              spouse: [
                {
                  name: personData["SpouseName"],
                  dateBirth: personData["SpouseDateBirth"],
                  dateDeath: personData["SpouseDateDeath"],
                  dateWedding: personData["SpouseDateWedding"],
                },
              ],
              children: data.data.children,
            },
          };
        } else {
          data.data.name = personData["Name"];
          data.data.dateBirth = personData["DateBirth"];
          data.data.dateDeath = personData["DateDeath"];
          data.data.spouse[0].name = personData["SpouseName"];
          data.data.spouse[0].dateBirth = personData["SpouseDateBirth"];
          data.data.spouse[0].dateDeath = personData["SpouseDateDeath"];
          data.data.spouse[0].dateWedding = personData["SpouseDateWedding"];
          while (parentData !== null && parentData.parent !== null) {
            parentData = parentData.parent;
          }
          newData = {
            people: parentData.data,
          };
        }
      }
      updateTree(newData);
    });
  });
  $(".trash").on("click", function () {
    // data.data = "";
    // let parentData = data.parent;
    // while (parentData !== null && parentData.parent !== null) {
    //   parentData = parentData.parent;
    // }

    // let newData = {
    //   people: parentData ? parentData.data : data.data,
    // };
    showInfo("Funkcja usuwania osób zostanie dodana w przyszłości.");
  });

  // add child, parents or spouse to person
  $(".button-person-option").on("click", function () {
    let dataPerson = $(this).attr("data-person");
    $(".container-add-person").addClass("grid");
    $(".container-add-person").animate({ left: 0 }, 1000);
    let options;
    let inputLength;
    let buttonAddPerson;
    switch (dataPerson) {
      case "person":
      case "child":
        inputLength = 2;
        buttonAddPerson = personOption[0];
        options = [
          ["name", "Imię i nazwisko"],
          ["date-birth", "Data ur."],
          ["date-death", "Data zm."],
        ];
        break;
      case "marriage":
      case "parents":
        inputLength = 6;
        buttonAddPerson = personOption[1];
        options = [
          ["name grid-cl-1-2 grid-row-1-2", "Imię i nazwisko"],
          ["date-birth grid-cl-1-2 grid-row-2-3", "Data ur."],
          ["date-death grid-cl-1-2 grid-row-3-4", "Data zm."],
          ["spouse-name grid-cl-3-4 grid-row-1-2", "Imię i nazwisko współmałżonka"],
          ["spouse-date-birth grid-cl-3-4 grid-row-2-3", "Data ur. współmałżonka"],
          ["spouse-date-death grid-cl-3-4 grid-row-3-4", "Data zm. współmałżonka"],
          ["date-wedding grid-cl-2-3 grid-row-5-6", "Data ślubu"],
        ];
        break;
      case "spouse":
        inputLength = 3;
        buttonAddPerson = personOption[2];
        options = [
          ["spouse-name", "Imię i nazwisko współmałżonka"],
          ["spouse-date-birth", "Data ur. współmałżonka"],
          ["spouse-date-death", "Data zm. współmałżonka"],
          ["date-wedding", "Data ślubu"],
        ];
        break;
      default:
        break;
    }
    $(".container-add-person").html(
      buttonClose +
        `<div class="person"></div>
          <div class="buttons">
          <button type="button" class="add-person buttons-animation">${$(this).text()}</button>
        </div>`
    );
    let allInputs = "";
    for (let i = 0; i <= inputLength; i++) {
      allInputs += `
      <div class="data-div ${options[i][0]}">
        <label>${options[i][1]}</label>
        <input type="text">
      </div>`;
    }
    $(".container-add-person > .person").html(allInputs);

    $(".add-person").on("click", function () {
      let valButton = buttonAddPerson[0];
      let parent = $(this).parent().parent();
      let personData = getPersonData(parent);
      // Create the new person object
      let newPerson;
      let newData;
      let parentData = data.parent;
      switch (valButton) {
        case "dziecko":
          newPerson = {
            name: personData["Name"],
            dateBirth: personData["DateBirth"],
            dateDeath: personData["DateDeath"],
            spouse: [],
            children: [],
          };
          data.data.children.push(newPerson);

          while (parentData !== null && parentData.parent !== null) {
            parentData = parentData.parent;
          }
          newData = {
            people: parentData ? parentData.data : data.data,
          };
          break;
        case "rodziców":
          newData = {
            people: {
              name: personData["Name"],
              dateBirth: personData["DateBirth"],
              dateDeath: personData["DateDeath"],
              spouse: [
                {
                  name: personData["SpouseName"],
                  dateBirth: personData["SpouseDateBirth"],
                  dateDeath: personData["SpouseDateDeath"],
                  dateWedding: personData["SpouseDateWedding"],
                },
              ],
              children: [data.data],
            },
          };
          break;
        case "współmałżonka":
          newPerson = {
            name: personData["SpouseName"],
            dateBirth: personData["SpouseDateWedding"],
            dateDeath: personData["SpouseDateDeath"],
            dateWedding: personData["SpouseDateWedding"],
          };
          data.data.spouse.push(newPerson);
          while (parentData !== null && parentData.parent !== null) {
            parentData = parentData.parent;
          }
          newData = {
            people: parentData ? parentData.data : data.data,
          };
          break;
        default:
          break;
      }
      updateTree(newData);
    });
  });
}
//**********************//
// action on person end //
//**********************//
function showInfo(info) {
  $(".message-box").addClass("grid");
  $(".message-box").animate(
    {
      left: (widthElement - $(".message-box").width()) / 2,
    },
    800
  );
  $(".show-info").text(info);
  $(".button-confirm").on("click", function () {
    $(this).parent().find(".close").trigger("click");
  });
}
$(document).on("click", ".close", function () {
  $(this)
    .parent()
    .first()
    .animate({ left: widthElement }, 1000, function () {
      $(this).removeClass("grid");
      $(this).removeAttr("style");
    });
});
function animateAndClear(element) {
  element.animate({ left: widthElement }, 1000, function () {
    $(this).removeClass("grid");
    $(this).html("");
    $(this).removeAttr("style");
  });
}
function updateTree(data) {
  // Create the final data structure for JSON serialization
  var updatedData = JSON.stringify(data);
  // Save the updated JSON data back to localStorage
  localStorage.setItem("FamilyData", updatedData);

  animateAndClear($("#PersonInfo"));
  animateAndClear($(".container-add-person"));

  $("#tree svg g").html("");
  createPeopleTree();
}
