import * as fs from "fs" 
import PromptSync from "prompt-sync"
 export function saveModel(obj, name) {
    fs.writeFileSync("./model/" + name + ".json", JSON.stringify(obj), "utf8")
 }
 export function getModel(name) {
    return JSON.parse(fs.readFileSync("./model/"+ name + ".json", "utf8"))
 }
 export function input(string) {
    return PromptSync({autocomplete : [fs.readdirSync("./model").forEach((value) => {value.slice(0, value.length-5)})]})(string)
 }