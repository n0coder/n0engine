export class CosmicEntityManager {
  constructor() {
    this.entities = new Map();
    this.functions = new Map();
  }
  addEntity(entity, renderOrder = 0) {
    if (!this.entities.has(entity.constructor.name)) {
      this.entities.set(entity.constructor.name, []);
    }
    this.entities.get(entity.constructor.name).push(entity);

    entity.renderOrder ??= renderOrder

    //let seen = new Set(); //gather only surface level properties... of all prototypes...
    //don't know why but this seen tech breaks all the objects so i disabled it before it was really added

    //this feels like "pirate software lighting code"
    //i run current object member gatherer functions

    const propertyNames = Object.getOwnPropertyNames(entity);
      for (const propertyName of propertyNames) {
        if (typeof entity[propertyName] === 'function' && propertyName !== 'super' && propertyName !== 'constructor') {
          if (!this.functions.has(propertyName)) {
            this.functions.set(propertyName, []);
          }
          this.functions.get(propertyName).push(entity);
          //seen.add(propertyName);
        }
      }
    
    //then i run through all the prototypes and gather their functions (excluding base objfunctions) 
    let proto = Object.getPrototypeOf(entity);
    while (proto !== null && proto.constructor.name !== 'Object') {
      const propertyNames = Object.getOwnPropertyNames(proto);
      for (const propertyName of propertyNames) {
        if (typeof proto[propertyName] === 'function' 
            && propertyName !== 'super' 
            && propertyName !== 'constructor' 
            //&& seen.has(propertyName)
          ) {
          if (!this.functions.has(propertyName)) {
            this.functions.set(propertyName, []);
          }
          this.functions.get(propertyName).push(entity);
          //seen.add(propertyName)
        }
      }
      proto = Object.getPrototypeOf(proto);
    }
  }

  removeEntity(entity) {
    const entitiesOfType = this.entities.get(entity.constructor.name);
    if (entitiesOfType) {
      const index = entitiesOfType.indexOf(entity);
      if (index > -1) {
        entitiesOfType.splice(index, 1);
      }
    }

    for (const [functionName, entityList] of this.functions) {
      const index = entityList.indexOf(entity);
      if (index > -1) {
        entityList.splice(index, 1);
      }
    }
  }

  invoke(functionName, ...args) {
    
    const entitiesWithFunction = this.functions.get(functionName) || [];

    if (functionName === "draw") 
      entitiesWithFunction.sort((a,b)=>a.renderOrder - b.renderOrder)
    //console.warn("move sort to other function AND implement single object position finder (one item sort in array)")

    entitiesWithFunction.forEach(entity => {
      if (typeof entity[functionName] === "function") {
        entity[functionName](...args);
      }
    });
  }

  getEntitiesByFunction(functionName) {
    return this.functions.get(functionName) || [];
  }

  getEntitiesByType(type) {
    return this.entities.get(type) || [];
  }

  contains(entity) {
    var c = this.entities.get(entity.constructor.name);
    if (!c) return false;
    return c.includes(entity);
  }

}

export const cosmicEntityManager = new CosmicEntityManager();


export function setActive(state) {
  var exists = cosmicEntityManager.contains(this)
  if (state) {
    if (!exists) {
      cosmicEntityManager.addEntity(this);
    }
  } else {
    if (exists) {
      cosmicEntityManager.removeEntity(this);
    }
  }
}