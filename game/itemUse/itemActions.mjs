export const itemActions = new Map();
itemActions.getset = function (actions) {
    let v = this.get(actions);
    if (!v) {
        v = new Map()
        this.set(actions, v)
    }
    return v;
}
export const workProfile = new Map();
export function useItems(nanoai, origin, actions) {

    var nanosItems = workProfile.get(nanoai);
    if (nanosItems) {
        //console.log([`loaded profile for ${nanoai.name}`,  nanosItems])
        for (let i = 0; i < Math.min(nanoai.inventory.list.length, nanoai.inventory.offsets.length); i++) {
            var item = nanoai.inventory.list[i]
            var itemProfile = nanosItems.get(item.constructor.name)
            if (itemProfile) {
                if (itemProfile.isDone) {
                    nanosItems.delete();
                } else {
                    return true; //keep waiting
                }
            }
        }
        workProfile.delete(nanoai)
        return false; //jobs done we can move on
    } else {
        nanosItems = new Map();
        workProfile.set(nanoai, nanosItems);
        for (let i = 0; i < Math.min(nanoai.inventory.list.length, nanoai.inventory.offsets.length); i++) {
            var item = nanoai.inventory.list[i]
            var actionSet = itemActions.get(actions)
            if (!actionSet) continue;
            var action = actionSet.get(item.constructor.name)
            if (action) {
                var obj = {
                    isDone: false,
                    done: function () {
                        this.isDone = true
                    }
                }
                action(nanoai, item, origin, obj);
                nanosItems.set(item.constructor.name, obj);
            }
        }
        return true
    }
}