export class myModule {
    constructor() {}

    useCommand = (commandInput) => {
        let [result, stdout, stderr] = GLib.spawn_command_line_sync(commandInput)
    
        if (result) log(`${prefix} Output: ${stdout.toString()}`)
        else log(`${prefix} Error: ${stderr.toString()}`)
        return true;
    }

    minutesToMiliseconds = (minutes) => {
        return ( minutes * 60 ) * 1000
    } 
}