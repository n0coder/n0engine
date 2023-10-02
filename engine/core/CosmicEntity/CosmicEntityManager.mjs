export class CosmicEntityManager {
  constructor() {
    this.entities = new Map();
    this.functions = new Map();
  }
  addEntity(entity) {
    if (!this.entities.has(entity.constructor.name)) {
        this.entities.set(entity.constructor.name, []);
    }
    this.entities.get(entity.constructor.name).push(entity);
    
    let proto = Object.getPrototypeOf(entity);
while (proto !== null && proto.constructor.name !== 'Object') {
  const propertyNames = Object.getOwnPropertyNames(proto);
  for (const propertyName of propertyNames) {
    if (typeof proto[propertyName] === 'function' && propertyName !== 'super' && propertyName !== 'constructor') {
      if (!this.functions.has(propertyName)) {
        this.functions.set(propertyName, []);
    }
    this.functions.get(propertyName).push(entity);
  
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