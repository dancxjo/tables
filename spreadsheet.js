function Table(tableId, data, headings) {
  this.table = document.getElementById(tableId);
  this.data = data;
  this.headings = headings;
  
  this.clear = function () {
    for (var index=this.table.rows.length - 1; index >= 0; index--) {
    	this.table.deleteRow(index);
  	}
  };
  
  this.makeHeadings = function () {
    var header = this.table.createTHead();
    var row = this.table.insertRow(0);
    for (var index in this.headings) {
      var cell = row.insertCell(-1);
      cell.innerHTML = this.headings[index];
    }
  }
  
  this.update = function () {
    this.clear(); // Erase what's already in the table
    this.makeHeadings(); // Make the headingings
  };
  
  this.update(); // Go ahead and fill the table with data
}
