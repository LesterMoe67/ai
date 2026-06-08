async function getStocks () {
    let obj = []
    let string = "https://api.massive.com/v3/reference/tickers?apiKey=iDcnbSCEzQbNaCbpzEFCLmFpv7Pq1bdd"
    let append = ""
    let running = true
    while (running) {
        let result = await ( await fetch(string + append)).json()
        obj.push(...result.results)
        if (typeof(result.next_url) == undefined) {
            running = false
        } else {
            append = "&" + result.next_url.slice(45)
        }
        console.log(append)
    }

    return obj
}
console.log(await getStocks())