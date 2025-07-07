export class Sudoku{
    constructor(){
        this.grid = [];
        this.gridSolution = [];
        this.gridDifficulty = null;
        this.url = "https://sudoku-api.vercel.app/api/dosuku";
        this.containerGrid = document.querySelector("main .grid");
        this.numbersList = document.querySelector("main ul.numbers");
        this.numbers = this.numbersList.querySelectorAll("main .numbers-items button");
        this.loadPanel = document.querySelector("body .load-panel");
        this.difficultyTarget = document.querySelector("main span.difficulty");
        this.tryTarget = document.querySelector("main span.try");
        this.loadClassname = "loading";
        this.errorsCount = 0;
        this.maxTry = 3;
        this.defeatedModal = document.querySelector(".modal.defeated-message");
        this.tileRemaining = 9999;

        this.init();
    }

    init(){
        this.prepareGrid();
        this.prepareNumberButtons();
        this.prepareKeyboardEvents();
    }

    prepareKeyboardEvents(){
        document.addEventListener("keydown", (e) => {
            if(e.key >= 1 && e.key <= 9){
                this.attributeValueToCell(e.key);
            }
            if(e.key == "Backspace"){
                this.removeValue();
            }
        });
    }

    async prepareGrid(){
        this.loadGrid();
        const isSudokuCatched = await this.fetchSudoku();

        if(isSudokuCatched){
            this.buildGrid();
            this.prepareGridCells();
            this.showGrid();
            this.setDifficulty();
            this.setTry();
            this.setTileRemaining();
        } else {
            return;
        }
    }

    prepareNumberButtons(){
        this.numbers.forEach((button) => {
            button.addEventListener("click", (e) => {
                const value = button.getAttribute("data-value");
                this.attributeValueToCell(value);
            });
        });
    }

    removeValue(key){
        const selectedCell = this.containerGrid.querySelector(".grid-cell.selected");
        if(selectedCell && !selectedCell.classList.contains("success")){
            selectedCell.innerHTML = "";
        }
    }

    prepareGridCells(){
        const cells = this.containerGrid.querySelectorAll(".grid-cell");

        cells.forEach((cell) => {
            cell.addEventListener("click", () => {
                this.selectCell(cell);
            });
        });
    }

    selectCell(cell){
        const cells = this.containerGrid.querySelectorAll(".grid-cell");
        cells.forEach((cell) => {
            cell.classList.remove("selected");
        })
        cell.classList.add("selected");

        if(this.numbersList.classList.contains("hidden")){
            this.numbersList.classList.remove("hidden");
        }
    }

    attributeValueToCell(value){
        const selectedCell = this.containerGrid.querySelector(".grid-cell.selected");
        const row = selectedCell.getAttribute("data-row");
        const cell = selectedCell.getAttribute("data-cell");

        this.grid[row][cell] = value;
        selectedCell.innerHTML = value;
        if(selectedCell.classList.contains("filled")){
            selectedCell.classList.remove("filled");
        }
        this.checkValue(row, cell, value, selectedCell);
    }

    checkValue(row, cell, value, selectedCell){
        const cellValue = this.gridSolution[row][cell];

        if(cellValue != value){
            this.addError();
            selectedCell.classList.add("error");
            selectedCell.classList.remove("success");
        } else {
            selectedCell.classList.remove("error");
            selectedCell.classList.add("success");
        }
    }

    loadGrid(){
        if(!this.loadPanel.classList.contains(this.loadClassname)){
            this.loadPanel.classList.add(this.loadClassname);
        }
    }

    showGrid(){
        if(this.loadPanel.classList.contains(this.loadClassname)){
            this.loadPanel.classList.remove(this.loadClassname);
        }
    }

    buildGrid(){
        let html = "";

        this.grid.forEach((row, rowIndex) => {
            row.forEach((cell, cellIndex) => {
                html += `<div class="grid-cell ${cell == 0 ? "selectionnable" : "fixed"}" data-row="${rowIndex}" data-cell="${cellIndex}">${cell}</div>`;
            });
        });

        this.containerGrid.innerHTML = html;
    }

    setDifficulty(){
        if(this.gridDifficulty == "Easy"){
            this.difficultyTarget.innerHTML = "Facile";
        } else if(this.gridDifficulty == "Medium"){
            this.difficultyTarget.innerHTML = "Moyen";
        } else if(this.gridDifficulty == "Hard"){
            this.difficultyTarget.innerHTML = "Difficile";
        } else {
            this.difficultyTarget.innerHTML = "Inconnu";
        }
    }

    setTry(){
        this.tryTarget.innerHTML = this.maxTry - this.errorsCount;
    }

    setTileRemaining(){

    }

    async fetchSudoku(){
        try {
            const response = await fetch(this.url);
            const data = await response.json();
            this.grid = data.newboard.grids[0].value;
            this.gridSolution = data.newboard.grids[0].solution;
            this.gridDifficulty = data.newboard.grids[0].difficulty;

            return true;
        } catch (error) {
            console.error("Error fetching Sudoku:", error);
            return false;
        }
    }

    addError(){
        this.errorsCount++;
        this.setTry();
        if(this.errorsCount >= 3){
            this.defeatedState();
        }
    }

    defeatedState(){
        this.defeatedModal.classList.add("show");
    }
}