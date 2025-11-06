const person = {
  name: "Alice",
  greet: function () {
    console.log(this.name);
  },
};

const greet = person.greet.bind(person);

// const bounded = greet.bind(person);
// bounded();
greet();

// greet.call(person);

// greet.apply(person);
{
  const person = {
    name: "Alice",
    greet: () => {
      console.log(this.name);
    },
  };
}

const person2 = {
  name: "Alice",
  greet() {
    setTimeout(() => {
      console.log(this.name);
    }, 100);
  },
};

person2.greet();

class Person {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  greet() {
    console.log(this.name);
  }
}

const alice = new Person("Alice1");
const greet2 = alice.greet;

alice.greet();
// greet2();
