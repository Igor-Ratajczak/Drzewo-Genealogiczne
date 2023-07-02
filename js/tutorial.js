var storedData = localStorage.getItem("tutorial");
if (storedData === 1) {
  data;
  // Convert the modified JavaScript object back to JSON
  var updatedData = JSON.stringify(data);

  // Save the updated JSON data back to localStorage
  localStorage.setItem("myData", updatedData);
} else {
}
