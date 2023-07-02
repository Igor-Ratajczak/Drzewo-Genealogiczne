import { actionPerson, data } from "./script.js";

var storedData = localStorage.getItem("FamilyData");
if (storedData === null) {
  data;
  // Convert the modified JavaScript object back to JSON
  var updatedData = JSON.stringify(data);

  // Save the updated JSON data back to localStorage
  localStorage.setItem("FamilyData", updatedData);
} else {
}
//build tree
const width = $(window).width();
const height = $(window).height();
let i = 0;
const tree = d3
  .tree()
  .size([height, width])
  .nodeSize([350, 250])
  .separation((a, b) => {
    if (a.parent === b.parent) {
      if (a.data.spouse.length === 1 || b.data.spouse.length === 1) {
        return 2;
      } else {
        return 1;
      }
    } else {
      return 2;
    }
  });
const svg = d3.select("#tree").append("svg");
const g = svg.append("g");
// define a zoom behavior:
const zoom = d3.zoom().on("zoom", zoomed);

// call the zoom:
svg.call(zoom);

// trigger tha initial zoom with an initial transform.
svg.call(
  zoom.transform,
  d3.zoomIdentity.scale(1).translate(width / 2, height / 4)
);
// zoom as normal.
function zoomed(e) {
  g.attr("transform", e.transform);
}
$("#searchInput").on("click", function () {
  this.select();
});
$("#searchInput").on("input", function (e) {
  var searchText = $(this).val().toLowerCase();
  if (searchText === "") {
    $(".node > text > tspan").removeClass("stroke-red");
    $("#searchInput").removeAttr("list");
    $("#hintList").removeClass("grid");
  } else {
    var matchingElements = $(".node > text > tspan").filter(function () {
      $("#hintList").addClass("grid");
      var text = $(this).text().toLowerCase();
      $(this).removeClass("stroke-red");
      return text.includes(searchText);
    });
    matchingElements.each(function () {
      $(this).addClass("stroke-red");
    });

    var hintList = "";
    matchingElements.each(function () {
      let base = "";
      $(this)
        .parent()
        .parent()
        .find("text")
        .each(function () {
          if (
            $(this).text() === "<empty string>" ||
            $(this).text() === undefined
          ) {
          } else {
            base += " " + $(this).text();
          }
        });
      var hintOption = `<option value="${base}" data-id="${$(this)
        .parent()
        .parent()
        .attr("data-id")}"><p>${base}</p></option>`;

      hintList += hintOption;
    });

    $("#hintList").empty().append(hintList);
    $("#hintList")
      .find("option")
      .on("click", function (e) {
        $(".active").removeClass("active");
        $("#searchInput").val($(this).val());
        let www = $(this).attr("data-id");
        let element = $(`[data-id="${www}"]`).filter("g.node:eq(0)")[0];
        $(`[data-id="${www}"]`)
          .filter("g.node:eq(0)")
          .find("rect")
          .addClass("active");
        let position = element.__data__;
        let x = position.x;
        let y = position.y;
        let transformX = width / 2 - x;
        let transformY = height / 2 - y;

        svg.call(
          zoom.transform,
          d3.zoomIdentity.scale(1).translate(transformX, transformY)
        );
        $(".stroke-red").removeClass("stroke-red");
        $("#tree").on("click", function () {
          $(".active").removeClass("active");
        });
      });
  }
});
$("#searchInput").on("keydown", function (e) {
  var options = $("#hintList option"); // Get all the options within the select element
  var selectedIndex = options.index($("option:selected")); // Get the index of the currently selected option

  if (e.key === "ArrowUp") {
    let newIndex = selectedIndex === options.length ? 1 : selectedIndex - 1; // Set the new index to the previous option or wrap around to the last option if it's the first one
    options.prop("selected", false); // Remove selection from all options
    selectedIndex = newIndex;
    options.eq(selectedIndex).prop("selected", true); // Select the new option
  }

  if (e.key === "ArrowDown") {
    let newIndex = selectedIndex === options.length - 1 ? 0 : selectedIndex + 1; // Set the new index to the next option or wrap around to the first option if it's the last one
    options.prop("selected", false); // Remove selection from all options
    selectedIndex = newIndex;
    options.eq(selectedIndex).prop("selected", true); // Select the new option
  }
  if (e.key === "Enter") {
    if (options.is(":selected")) {
      $("#hintList").removeClass("grid");
      let optionSelected = $("#hintList option:selected");
      $(this).val(optionSelected.val());
      $(".active").removeClass("active");
      let www = $(optionSelected).attr("data-id");
      let element = $(`[data-id="${www}"]`).filter("g.node:eq(0)")[0];
      $(`[data-id="${www}"]`)
        .filter("g.node:eq(0)")
        .find("rect")
        .addClass("active");
      let position = element.__data__;
      let x = position.x;
      let y = position.y;
      let transformX = width / 2 - x;
      let transformY = height / 2 - y;

      svg.call(
        zoom.transform,
        d3.zoomIdentity.scale(1).translate(transformX, transformY)
      );

      $(".stroke-red").removeClass("stroke-red");
      $("#tree").on("click", function () {
        $(".active").removeClass("active");
      });
    }
  }
});
$("body").on("click", function (e) {
  if (!$("#hintList").is(e.target) && !$("#hintList").has(e.target).length) {
    $("#hintList").removeClass("grid");
  }
  if (
    $("#hintList option").is(e.target) ||
    $("#hintList option").has(e.target).length
  ) {
    $("#hintList").removeClass("grid");
  }
});
createPeopleTree();
export function createPeopleTree() {
  var people = localStorage.getItem("FamilyData");
  let peopleData = JSON.parse(people).people;
  // Compute the new tree layout.
  const nodes = d3.hierarchy(peopleData);
  // Maps the node data to the tree layout
  tree(nodes);

  // Normalize for fixed-depth.
  // nodes.y = nodes.depth * 100;
  // Declare the nodes…
  const node = g.selectAll("g.node").data(nodes, (d) => {
    return d.id || (d.id = ++i);
  });
  const links = g.append("g");
  links
    .selectAll(".link")
    .data(nodes.links())
    .enter()
    .append("path")
    .attr("class", "link")
    .attr(
      "d",
      d3
        .linkVertical()
        .x((d) =>
          d.data.spouse.length === 1
            ? d.data.children.length === 0
              ? d.x
              : d.x - 150
            : d.x
        )
        .y((d) => d.y)
    )
    .style("opacity", 0);
  // Enter the nodes.
  // add node
  const nodeEnter = node
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("data-id", (d) =>
      d.data.spouse.length === 1
        ? d.id + "container-marriage"
        : d.id + "container-person"
    )
    .attr("transform", (d) => `translate(${d.x},${d.y})`)
    .on("click", actionPerson)
    .style("opacity", 0);

  nodeEnter
    .append("rect")
    .attr("class", "rect")
    .attr("rx", "2em")
    .attr("ry", "50px")
    .attr("width", (d) => `${d.data.spouse.length === 1 ? "30em" : "20em"}`)
    .attr("height", "8em")
    .attr(
      "transform",
      (d) => `translate(${d.data.spouse.length === 1 ? -250 : -150})`
    );
  d3.selectAll("g.node").transition().duration(1000).style("opacity", 1);
  d3.selectAll("path.link").transition().duration(1000).style("opacity", 1);
  const addText = (className, xVal1, xVal2, yVal, text) => {
    nodeEnter
      .append("text")
      .attr("class", className)
      .attr("x", (d) => (d.data.spouse.length === 1 ? xVal1 : xVal2))
      .attr("y", yVal)
      .attr("dy", ".35em")
      .attr("stroke", (d) => (d.data.dateDeath === "" ? "darkgreen" : "black"))
      .attr("text-anchor", "middle")
      .attr("data-value", className)
      .html(text);
  };

  // class name node, x with node spouse, x without node spouse, y node, text node
  addText("name", -150, 0, 10, (d) =>
    d.data.name === "" ? "<tspan></tspan>" : `<tspan>${d.data.name}</tspan>`
  );
  addText("date-birth", -150, 0, 30, (d) =>
    d.data.dateBirth === ""
      ? "<tspan></tspan>"
      : `ur. <tspan>${d.data.dateBirth}</tspan>`
  );

  addText("date-death", -150, 0, 50, (d) =>
    d.data.dateDeath === ""
      ? "<tspan></tspan>"
      : `zm. <tspan>${d.data.dateDeath}</tspan>`
  );

  addText("spouse-name", 120, 0, 10, (d) =>
    d.data.spouse.length === 1 && d.data.spouse[0].name !== ""
      ? `<tspan>${d.data.spouse[0].name}</tspan>`
      : "<tspan></tspan>"
  );

  addText("spouse-date-birth", 120, 0, 30, (d) =>
    d.data.spouse.length === 1 && d.data.spouse[0].dateBirth !== ""
      ? `ur. <tspan>${d.data.spouse[0].dateBirth}</tspan>`
      : "<tspan></tspan>"
  );

  addText("spouse-date-death", 120, 0, 50, (d) =>
    d.data.spouse.length === 1 && d.data.spouse[0].dateDeath !== ""
      ? `zm. <tspan>${d.data.spouse[0].dateDeath}</tspan>`
      : "<tspan></tspan>"
  );

  addText("date-wedding grid-col-2-3 grid-row-5-6", 0, 0, 100, (d) =>
    d.data.spouse.length === 1 && d.data.spouse[0].dateWedding !== ""
      ? `data ślubu: <tspan>${d.data.spouse[0].dateWedding}</tspan>`
      : "<tspan></tspan>"
  );
}
