const LEN_MAP = {
  destroyer: 2,
  cruiser: 3,
  battleship: 4
};

const generateFieldArr = (r, c) => {
  let arr = [];
  for (let i = 0; i < r; i++) {
    arr[i] = [];
    for (let j = 0; j < c; j++) {
      arr[i][j] = ' ';
    }
  }
  return arr;
};

const genSecondPart = (base, field) => {
  let point = {
    x: -1,
    y: -1
  };

  let nX, nY;

  do {
    nX = Math.random();
    if (nX < 0.33) {
      point.x = base.x - 1;
    } else if (0.33 <= nX < 0.66) {
      point.x = base.x;
    } else {
      point.x = base.x + 1;
    }
  } while (point.x < 0 || point.x >= field.c);

  while ((point.x === base.x) && (0.33 <= nY < 0.66)) {
    nY = Math.random();
  }

  do {
    nY = Math.random();
    if (nY < 0.33) {
      point.y = base.y - 1;
    } else if (0.33 <= nY < 0.66){
      point.y = base.y;
    } else {
      point.y = base.y + 1;
    }
  } while (point.y < 0 || point.y >= field.r);

  return point;
};

const genOtherParts = (ship, field) => {
  for (let i = 2; i < ship.length; i++) {
    ship.parts.push(getValidPart(ship.parts[0], ship.parts[1], field));
  }
};

const getValidPart = (base, second, field) => {
  if (base.x === second.x) {
    if (second.y < base.y) {
      if (second.y - 1 >= 0) {
        return { x: base.x, y: second.y - 1 };
      } else {
        return { x: base.x, y: base.y + 1 };
      }
    } else {
      if (second.y + 1 < field.r) {
        return { x: base.x, y: second.y + 1 };
      } else {
        return { x: base.x, y: base.y - 1 }
      }
    }
  } else {
    if (base.y === second.y) {
      if (second.x < base.x) {
        if (second.x - 1 >= 0) {
          return { x: second.x - 1, y: base.y };
        } else {
          return { x: base.x + 1, y: base.y };
        }
      } else {
        if (second.x + 1 < field.c) {
          return { x: second.x + 1, y: base.y };
        } else {
          return { x: base.x - 1, y: base.y };
        }
      }
    } else {
      if (second.x < base.x && second.y < base.y) {
        if (second.x - 1 >= 0 && second.y - 1 >= 0) {
          return { x: second.x - 1, y: second.y - 1 };
        } else {
          return { x: base.x + 1, y: base.y + 1 };
        }
      } else if (second.x > base.x && second.y > base.y) {
        if (second.x + 1 < field.c && second.y + 1 < field.r) {
          return { x: second.x + 1, y: second.y + 1 };
        } else {
          return { x: base.x - 1, y: base.y - 1 };
        }
      } else if (second.x < base.x && second.y > base.y) {
        if (second.x - 1 >= 0 && second.y + 1 < field.r) {
          return { x: second.x - 1, y: second.y + 1 };
        } else {
          return { x: base.x + 1, y: base.y - 1 };
        }
      } else {
        if (second.x + 1 < field.c && second.y - 1 >= 0) {
          return { x: second.x + 1, y: second.y - 1 };
        } else {
          return { x: base.x - 1, y: base.y + 1 };
        }
      }
    }
  }
};

const generateShip = (type, field) => {
  let ship = new Ship(type);
  let part0 = {};
  console.log("field.c = ", field.c);
  console.log("field.r = ", field.r);
  part0.x = Math.floor(Math.random() * field.c);
  part0.y = Math.floor(Math.random() * field.r);
  ship.parts[0] = part0;
  ship.parts[1] = genSecondPart(part0, field);
  console.log(ship);
  genOtherParts(ship, field);
  return ship;
};

const Ship = function(type) {
  this.type = type;
  this.length = LEN_MAP[this.type];
  this.parts = [];
}

const Field = function(r, c) {
  this.r = r;
  this.c = c;
  this.ships = {
    destroyer: generateShip('destroyer', this),
    cruiser: generateShip('cruiser', this),
    battleship: generateShip('battleship', this)
  };
  this.shipsSunk = 0;
  this.arr = generateFieldArr(r, c);
};

Field.prototype.hasShip = function(pos) {
  for (ship in this.ships) {
    for (part of this.ships[ship].parts) {
      if (pos.x === part.x && pos.y === part.y)
        return true;
    }
  }
  return false;
};

const Board = function(r, c) {
  this.rows = r;
  this.columns = c;
  this.fieldP1 = new Field(r, c);
  this.fieldP2 = new Field(r, c);
};

Board.prototype.print = function() {
  let str = '';
  for (let i = 0; i < this.rows; i++) {
    for (let j = 0; j < this.columns; j++) {
      if (this.fieldP1.hasShip({x: i, y: j}))
        str += 'S ';
      else
        str += this.fieldP1.arr[i][j] + ' ';
    }
    str += '| ';
    for (let k = 0; k < this.columns; k++) {
      if (this.fieldP2.hasShip({x: i, y: k}))
        str += 'S ';
      else
        str += this.fieldP2.arr[i][k] + ' ';
    }
    str += '\n';
  }
  console.log(str);
};

(new Board(8, 8)).print();