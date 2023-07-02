import { actionPerson } from "./script.js";
function updateFamilyTree() {
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
        return 1;
      }
    });
  const svg = d3.select("#tree").select("svg");
  const g = svg.select("g");

  const links = g.select("g.links");

  // load the data from the LocalStorage
  var people = localStorage.getItem("myData");
  let peopleData = JSON.parse(people).people;
  createPeopleTree(peopleData);

  function createPeopleTree(people) {
    // Compute the new tree layout.
    const nodes = d3.hierarchy(people);
    // Maps the node data to the tree layout
    tree(nodes);
    console.log(nodes);
    // Declare the nodes…
    const node = g.selectAll("g.node").data(nodes, (d) => {
      return d.id || (d.id = ++i);
    });

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
          .x((d) => d.x)
          .y((d) => d.y)
      );

    const addNode = (node) => {
      const nodeEnter = node
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", (d) => `translate(${d.x},${d.y})`)
        .on("click", actionPerson);

      nodeEnter
        .append("rect")
        .attr("class", "rect")
        .attr("rx", "2em")
        .attr("ry", "50px")
        .attr(
          "transform",
          (d) => `translate(${d.data.spouse.length === 1 ? -250 : -150})`
        )
        .attr("width", (d) => `${d.data.spouse.length === 1 ? "30em" : "20em"}`)
        .attr("height", "8em");

      const addText = (className, xVal1, xVal2, yVal, text) => {
        nodeEnter
          .append("text")
          .attr("class", className)
          .attr("x", (d) => (d.data.spouse.length === 1 ? xVal1 : xVal2))
          .attr("y", yVal)
          .attr("dy", ".35em")
          .attr("text-anchor", "middle")
          .attr("data-value", className)
          .html(text);
      };

      addText("name", -150, 0, 10, (d) =>
        d.data.name === "" ? "<tspan></tspan>" : `<tspan>${d.data.name}</tspan>`
      );
      addText("date-birth", -150, 0, 30, (d) =>
        d.data.dateBirth === ""
          ? "<tspan></tspan>"
          : `ur.<tspan>${d.data.dateBirth}</tspan>`
      );

      addText("date-death", -150, 0, 50, (d) =>
        d.data.dateDeath === ""
          ? "<tspan></tspan>"
          : `zm.<tspan>${d.data.dateDeath}</tspan>`
      );

      addText("spouse-name", 120, 0, 10, (d) =>
        d.data.spouse.length === 1 && d.data.spouse[0].name !== ""
          ? `<tspan>${d.data.spouse[0].name}</tspan>`
          : "<tspan></tspan>"
      );

      addText("spouse-date-birth", 120, 0, 30, (d) =>
        d.data.spouse.length === 1 && d.data.spouse[0].dateBirth !== ""
          ? `ur.<tspan>${d.data.spouse[0].dateBirth}</tspan>`
          : "<tspan></tspan>"
      );

      addText("spouse-date-death", 120, 0, 50, (d) =>
        d.data.spouse.length === 1 && d.data.spouse[0].dateDeath !== ""
          ? `zm. <tspan>${d.data.spouse[0].dateDeath}</tspan>`
          : "<tspan></tspan>"
      );

      addText("date-wedding", 0, 0, 100, (d) =>
        d.data.spouse.length === 1 && d.data.spouse[0].dateWedding !== ""
          ? `data ślubu: <tspan>${d.data.spouse[0].dateWedding}</tspan>`
          : "<tspan></tspan>"
      );
    };

    addNode(node);
  }
}

// Export the function to be accessible from other files
export { updateFamilyTree };
