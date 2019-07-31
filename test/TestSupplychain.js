// This script is designed to test the solidity smart contract - SuppyChain.sol -- and the various functions within
// Declare a variable and assign the compiled smart contract artifact
var SupplyChain = artifacts.require('SupplyChain')

contract('SupplyChain', function(accounts) {
    // Declare few constants and assign a few sample accounts generated by ganache-cli
    var sku = 1
    var upc = 1
    const ownerID = accounts[0]
    const originManufacturerID = accounts[1]
    const originManufacturerName = "Pharma Company"
    const originManufacturerInformation = "Pharma Company Info"
    const originManufacturerLatitude = "-30.3079827"
    const originManufacturerLongitude = "-97.893485"
    var productID = sku + upc
    const productNotes = "Acetylsalicylic acid"
    const productPrice = web3.toWei(1, "ether")
    var itemState = 0
    const distributorID = accounts[2]
    const retailerID = accounts[3]
    const consumerID = accounts[4]
    const emptyAddress = '0x0000000000000000000000000000000000000000'
    
    const stateManufactured = 0;
    const statePackaged = 1;
    const stateForSale = 2;
    const stateSold = 3;
    const stateShipped = 4;
    const stateReceived = 5;
    const statePurchased = 6;
   

    ///Available Accounts
    ///==================
    ///(0) 0x27d8d15cbc94527cadf5ec14b69519ae23288b95
    ///(1) 0x018c2dabef4904ecbd7118350a0c54dbeae3549a
    ///(2) 0xce5144391b4ab80668965f2cc4f2cc102380ef0a
    ///(3) 0x460c31107dd048e34971e57da2f99f659add4f02
    ///(4) 0xd37b7b8c62be2fdde8daa9816483aebdbd356088
    ///(5) 0x27f184bdc0e7a931b507ddd689d76dba10514bcb
    ///(6) 0xfe0df793060c49edca5ac9c104dd8e3375349978
    ///(7) 0xbd58a85c96cc6727859d853086fe8560bc137632
    ///(8) 0xe07b5ee5f738b2f87f88b99aac9c64ff1e0c7917
    ///(9) 0xbd3ff2e3aded055244d66544c9c059fa0851da44

    console.log("ganache-cli accounts used here...")
    console.log("Contract Owner: accounts[0] ", accounts[0])
    console.log("Manufacturer: accounts[1] ", accounts[1])
    console.log("Distributor: accounts[2] ", accounts[2])
    console.log("Retailer: accounts[3] ", accounts[3])
    console.log("Consumer: accounts[4] ", accounts[4])

    let supplyChainContract = null;

    
 
    
    it("Testing smart contract function manufactureItem() that allows a Manufacturer to manufacture a drug", async() => {            
    
        supplyChainContract = await SupplyChain.deployed()

        // set up account membership
        if(!await supplyChainContract.isManufacturer(originManufacturerID))
            await supplyChainContract.addManufacturer(originManufacturerID);

        if(!await supplyChainContract.isDistributor(distributorID))
            await supplyChainContract.addDistributor(distributorID);

        if(!await supplyChainContract.isRetailer(retailerID))
            await supplyChainContract.addRetailer(retailerID);

        if(!await supplyChainContract.isConsumer(consumerID))
            await supplyChainContract.addConsumer(consumerID);

        
        if(!await supplyChainContract.isManufacturer(originManufacturerID))
            await supplyChainContract.addManufacturer(originManufacturerID)

        let isManufacturer = await supplyChainContract.isManufacturer(originManufacturerID);
        assert.equal(isManufacturer, true);            

        let resultBufferOne = await supplyChainContract.fetchItemBufferOne.call(upc)            
        let sku = parseInt(resultBufferOne) + 1

        // Declare and Initialize a variable for event
        var eventEmitted = false
        
        // Watch the emitted event Manufactured()
        var event = supplyChainContract.Manufactured();
        await event.watch((err, res) => {
            eventEmitted = true
        })

        // Mark an item as Manufactured by calling function manufactureItem()
        await supplyChainContract.manufactureItem(upc, originManufacturerID, originManufacturerName, originManufacturerInformation, originManufacturerLatitude, originManufacturerLongitude, productNotes, {from: originManufacturerID})

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        resultBufferOne = await supplyChainContract.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChainContract.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], originManufacturerID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originManufacturerID, 'Error: Missing or Invalid originManufacturerID')
        assert.equal(resultBufferOne[4], originManufacturerName, 'Error: Missing or Invalid originManufacturerName')
        assert.equal(resultBufferOne[5], originManufacturerInformation, 'Error: Missing or Invalid originManufacturerInformation')
        assert.equal(resultBufferOne[6], originManufacturerLatitude, 'Error: Missing or Invalid originManufacturerLatitude')
        assert.equal(resultBufferOne[7], originManufacturerLongitude, 'Error: Missing or Invalid originManufacturerLongitude')
        assert.equal(resultBufferTwo[3], productNotes, 'Error: Missing or Invalid productNotes')        
        assert.equal(resultBufferTwo[5], stateManufactured, 'Error: Invalid item State')
        assert.equal(resultBufferTwo[6], emptyAddress, 'Error: Invalid distributorID')        
        assert.equal(resultBufferTwo[7], emptyAddress, 'Error: Invalid retailerID')        
        assert.equal(resultBufferTwo[8], emptyAddress, 'Error: Invalid consumerID') 
        assert.equal(eventEmitted, true, 'Invalid event emitted')        
    })    


    // 2nd Test
    it("Testing smart contract function packageItem() that allows a Manufacturer to package a drug", async() => {
        
        // Declare and Initialize a variable for event
        var eventEmitted = false

        // Watch the emitted event Manufactured()
        var event = supplyChainContract.Packaged()
        await event.watch((err, res) => {
            eventEmitted = true
        })        

        // Mark an item as Manufactured by calling function manufactureItem()
        await supplyChainContract.packageItem(upc, {from: originManufacturerID})        
        

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChainContract.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChainContract.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], originManufacturerID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originManufacturerID, 'Error: Missing or Invalid originManufacturerID')
        assert.equal(resultBufferOne[4], originManufacturerName, 'Error: Missing or Invalid originManufacturerName')
        assert.equal(resultBufferOne[5], originManufacturerInformation, 'Error: Missing or Invalid originManufacturerInformation')
        assert.equal(resultBufferOne[6], originManufacturerLatitude, 'Error: Missing or Invalid originManufacturerLatitude')
        assert.equal(resultBufferOne[7], originManufacturerLongitude, 'Error: Missing or Invalid originManufacturerLongitude')
        assert.equal(resultBufferTwo[3], productNotes, 'Error: Missing or Invalid productNotes')        
        assert.equal(resultBufferTwo[5], statePackaged, 'Error: Invalid item State') 
        assert.equal(resultBufferTwo[6], emptyAddress, 'Error: Invalid distributorID')        
        assert.equal(resultBufferTwo[7], emptyAddress, 'Error: Invalid retailerID')        
        assert.equal(resultBufferTwo[8], emptyAddress, 'Error: Invalid consumerID') 
        assert.equal(eventEmitted, true, 'Invalid event emitted')
    })    
  
    it("Testing smart contract function sellItem() that allows a manufcturer to sell a drug", async() => {
        
        // Declare and Initialize a variable for event
        var eventEmitted = false
        
        // Watch the emitted event Manufactured()
        var event = supplyChainContract.ForSale()
        await event.watch((err, res) => {
            eventEmitted = true
        })

        // Mark an item as Manufactured by calling function manufactureItem()
        await supplyChainContract.sellItem(upc, productPrice, {from: originManufacturerID})

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChainContract.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChainContract.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], originManufacturerID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originManufacturerID, 'Error: Missing or Invalid originManufacturerID')
        assert.equal(resultBufferOne[4], originManufacturerName, 'Error: Missing or Invalid originManufacturerName')
        assert.equal(resultBufferOne[5], originManufacturerInformation, 'Error: Missing or Invalid originManufacturerInformation')
        assert.equal(resultBufferOne[6], originManufacturerLatitude, 'Error: Missing or Invalid originManufacturerLatitude')
        assert.equal(resultBufferOne[7], originManufacturerLongitude, 'Error: Missing or Invalid originManufacturerLongitude')
        assert.equal(resultBufferTwo[3], productNotes, 'Error: Missing or Invalid productNotes')
        assert.equal(resultBufferTwo[4], productPrice, 'Error: Missing or Invalid productPrice')
        assert.equal(resultBufferTwo[5], stateForSale, 'Error: Invalid item State')     
        assert.equal(resultBufferTwo[6], emptyAddress, 'Error: Invalid distributorID')        
        assert.equal(resultBufferTwo[7], emptyAddress, 'Error: Invalid retailerID')        
        assert.equal(resultBufferTwo[8], emptyAddress, 'Error: Invalid consumerID')       
        assert.equal(eventEmitted, true, 'Invalid event emitted')
        
    });        
    

  
    it("Testing smart contract function buyItem() that allows a distributor to buy a drug", async() => {
        
        // Declare and Initialize a variable for event
        var eventEmitted = false
        
        // Watch the emitted event Manufactured()
        var event = supplyChainContract.Sold()
        await event.watch((err, res) => {
            eventEmitted = true
        })

        // Mark an item as Manufactured by calling function manufactureItem()
        await supplyChainContract.buyItem(upc, {from: distributorID, value:productPrice})

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChainContract.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChainContract.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], distributorID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originManufacturerID, 'Error: Missing or Invalid originManufacturerID')
        assert.equal(resultBufferOne[4], originManufacturerName, 'Error: Missing or Invalid originManufacturerName')
        assert.equal(resultBufferOne[5], originManufacturerInformation, 'Error: Missing or Invalid originManufacturerInformation')
        assert.equal(resultBufferOne[6], originManufacturerLatitude, 'Error: Missing or Invalid originManufacturerLatitude')
        assert.equal(resultBufferOne[7], originManufacturerLongitude, 'Error: Missing or Invalid originManufacturerLongitude')
        assert.equal(resultBufferTwo[3], productNotes, 'Error: Missing or Invalid productNotes')
        assert.equal(resultBufferTwo[4], productPrice, 'Error: Missing or Invalid productPrice')
        assert.equal(resultBufferTwo[5], stateSold, 'Error: Invalid item State')        
        assert.equal(resultBufferTwo[6], distributorID, 'Error: Invalid distributorID')        
        assert.equal(resultBufferTwo[7], emptyAddress, 'Error: Invalid retailerID')        
        assert.equal(resultBufferTwo[8], emptyAddress, 'Error: Invalid consumerID')    
        assert.equal(eventEmitted, true, 'Invalid event emitted')

    });    
  

    it("Testing smart contract function shipItem() that allows a distributor to ship a drug", async() => {
        
        // Declare and Initialize a variable for event
        var eventEmitted = false
        
        // Watch the emitted event Manufactured()
        var event = supplyChainContract.Shipped()
        await event.watch((err, res) => {
            eventEmitted = true
        })

        // Mark an item as Manufactured by calling function manufactureItem()
        await supplyChainContract.shipItem(upc, {from: originManufacturerID})

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChainContract.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChainContract.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], distributorID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originManufacturerID, 'Error: Missing or Invalid originManufacturerID')
        assert.equal(resultBufferOne[4], originManufacturerName, 'Error: Missing or Invalid originManufacturerName')
        assert.equal(resultBufferOne[5], originManufacturerInformation, 'Error: Missing or Invalid originManufacturerInformation')
        assert.equal(resultBufferOne[6], originManufacturerLatitude, 'Error: Missing or Invalid originManufacturerLatitude')
        assert.equal(resultBufferOne[7], originManufacturerLongitude, 'Error: Missing or Invalid originManufacturerLongitude')
        assert.equal(resultBufferTwo[3], productNotes, 'Error: Missing or Invalid productNotes')
        assert.equal(resultBufferTwo[4], productPrice, 'Error: Missing or Invalid productPrice')
        assert.equal(resultBufferTwo[5], stateShipped, 'Error: Invalid item State')       
        assert.equal(resultBufferTwo[6], distributorID, 'Error: Invalid distributorID')        
        assert.equal(resultBufferTwo[7], emptyAddress, 'Error: Invalid retailerID')        
        assert.equal(resultBufferTwo[8], emptyAddress, 'Error: Invalid consumerID')     
        assert.equal(eventEmitted, true, 'Invalid event emitted')
    });

    

    it("Testing smart contract function buyItem() that allows a retailer to receive a drug", async() => {
        
        // Declare and Initialize a variable for event
        var eventEmitted = false
        
        // Watch the emitted event Manufactured()
        var event = supplyChainContract.Received()
        await event.watch((err, res) => {
            eventEmitted = true
        })

        // Mark an item as Manufactured by calling function manufactureItem()
        await supplyChainContract.receiveItem(upc, {from: distributorID})

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChainContract.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChainContract.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], distributorID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originManufacturerID, 'Error: Missing or Invalid originManufacturerID')
        assert.equal(resultBufferOne[4], originManufacturerName, 'Error: Missing or Invalid originManufacturerName')
        assert.equal(resultBufferOne[5], originManufacturerInformation, 'Error: Missing or Invalid originManufacturerInformation')
        assert.equal(resultBufferOne[6], originManufacturerLatitude, 'Error: Missing or Invalid originManufacturerLatitude')
        assert.equal(resultBufferOne[7], originManufacturerLongitude, 'Error: Missing or Invalid originManufacturerLongitude')
        assert.equal(resultBufferTwo[3], productNotes, 'Error: Missing or Invalid productNotes')
        assert.equal(resultBufferTwo[4], productPrice, 'Error: Missing or Invalid productPrice')
        assert.equal(resultBufferTwo[5], stateReceived, 'Error: Invalid item State')        
        assert.equal(resultBufferTwo[6], distributorID, 'Error: Invalid distributorID')        
        assert.equal(resultBufferTwo[7], emptyAddress, 'Error: Invalid retailerID')        
        assert.equal(resultBufferTwo[8], emptyAddress, 'Error: Invalid consumerID')        
        assert.equal(eventEmitted, true, 'Invalid event emitted')
    })
    
    
    it("Testing smart contract function sellItem() that allows a ditributor to sell a drug", async() => {
        
        // Declare and Initialize a variable for event
        var eventEmitted = false
        
        // Watch the emitted event Manufactured()
        var event = supplyChainContract.ForSale()
        await event.watch((err, res) => {
            eventEmitted = true
        })

        // Mark an item as Manufactured by calling function manufactureItem()
        await supplyChainContract.sellItem(upc, productPrice, {from: distributorID})

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChainContract.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChainContract.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], distributorID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originManufacturerID, 'Error: Missing or Invalid originManufacturerID')
        assert.equal(resultBufferOne[4], originManufacturerName, 'Error: Missing or Invalid originManufacturerName')
        assert.equal(resultBufferOne[5], originManufacturerInformation, 'Error: Missing or Invalid originManufacturerInformation')
        assert.equal(resultBufferOne[6], originManufacturerLatitude, 'Error: Missing or Invalid originManufacturerLatitude')
        assert.equal(resultBufferOne[7], originManufacturerLongitude, 'Error: Missing or Invalid originManufacturerLongitude')
        assert.equal(resultBufferTwo[3], productNotes, 'Error: Missing or Invalid productNotes')
        assert.equal(resultBufferTwo[4], productPrice, 'Error: Missing or Invalid productPrice')
        assert.equal(resultBufferTwo[5], stateForSale, 'Error: Invalid item State')        
        assert.equal(resultBufferTwo[6], distributorID, 'Error: Invalid distributorID')        
        assert.equal(resultBufferTwo[7], emptyAddress, 'Error: Invalid retailerID')        
        assert.equal(resultBufferTwo[8], emptyAddress, 'Error: Invalid consumerID')     
        assert.equal(eventEmitted, true, 'Invalid event emitted')
    })


    it("Testing smart contract function buyItem() that allows a retailer to buy a drug", async() => {
        
        // Declare and Initialize a variable for event
        var eventEmitted = false
        
        // Watch the emitted event Manufactured()
        var event = supplyChainContract.Sold()
        await event.watch((err, res) => {
            eventEmitted = true
        })

        // Mark an item as Manufactured by calling function manufactureItem()
        await supplyChainContract.buyItem(upc, {from: retailerID, value: productPrice})

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChainContract.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChainContract.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], retailerID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originManufacturerID, 'Error: Missing or Invalid originManufacturerID')
        assert.equal(resultBufferOne[4], originManufacturerName, 'Error: Missing or Invalid originManufacturerName')
        assert.equal(resultBufferOne[5], originManufacturerInformation, 'Error: Missing or Invalid originManufacturerInformation')
        assert.equal(resultBufferOne[6], originManufacturerLatitude, 'Error: Missing or Invalid originManufacturerLatitude')
        assert.equal(resultBufferOne[7], originManufacturerLongitude, 'Error: Missing or Invalid originManufacturerLongitude')
        assert.equal(resultBufferTwo[3], productNotes, 'Error: Missing or Invalid productNotes')
        assert.equal(resultBufferTwo[4], productPrice, 'Error: Missing or Invalid productPrice')
        assert.equal(resultBufferTwo[5], stateSold, 'Error: Invalid item State')        
        assert.equal(resultBufferTwo[6], distributorID, 'Error: Invalid distributorID')        
        assert.equal(resultBufferTwo[7], retailerID, 'Error: Invalid retailerID')        
        assert.equal(resultBufferTwo[8], emptyAddress, 'Error: Invalid consumerID')     
        assert.equal(eventEmitted, true, 'Invalid event emitted')
    })

    it("Testing smart contract function shipItem() that allows a distibutor to ship a drug", async() => {
        
        // Declare and Initialize a variable for event
        var eventEmitted = false
        
        // Watch the emitted event Manufactured()
        var event = supplyChainContract.Shipped()
        await event.watch((err, res) => {
            eventEmitted = true
        })

        // Mark an item as Manufactured by calling function manufactureItem()
        await supplyChainContract.shipItem(upc, {from: distributorID})

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChainContract.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChainContract.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], retailerID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originManufacturerID, 'Error: Missing or Invalid originManufacturerID')
        assert.equal(resultBufferOne[4], originManufacturerName, 'Error: Missing or Invalid originManufacturerName')
        assert.equal(resultBufferOne[5], originManufacturerInformation, 'Error: Missing or Invalid originManufacturerInformation')
        assert.equal(resultBufferOne[6], originManufacturerLatitude, 'Error: Missing or Invalid originManufacturerLatitude')
        assert.equal(resultBufferOne[7], originManufacturerLongitude, 'Error: Missing or Invalid originManufacturerLongitude')
        assert.equal(resultBufferTwo[3], productNotes, 'Error: Missing or Invalid productNotes')
        assert.equal(resultBufferTwo[4], productPrice, 'Error: Missing or Invalid productPrice')
        assert.equal(resultBufferTwo[5], stateShipped, 'Error: Invalid item State')        
        assert.equal(resultBufferTwo[6], distributorID, 'Error: Invalid distributorID')        
        assert.equal(resultBufferTwo[7], retailerID, 'Error: Invalid retailerID')        
        assert.equal(resultBufferTwo[8], emptyAddress, 'Error: Invalid consumerID')     
        assert.equal(eventEmitted, true, 'Invalid event emitted')
    })

    it("Testing smart contract function receiveItem() that allows a retailer to receive a drug", async() => {
        
        // Declare and Initialize a variable for event
        var eventEmitted = false
        
        // Watch the emitted event Manufactured()
        var event = supplyChainContract.Received()
        await event.watch((err, res) => {
            eventEmitted = true
        })

        // Mark an item as Manufactured by calling function manufactureItem()
        await supplyChainContract.receiveItem(upc, {from: retailerID})

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChainContract.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChainContract.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], retailerID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originManufacturerID, 'Error: Missing or Invalid originManufacturerID')
        assert.equal(resultBufferOne[4], originManufacturerName, 'Error: Missing or Invalid originManufacturerName')
        assert.equal(resultBufferOne[5], originManufacturerInformation, 'Error: Missing or Invalid originManufacturerInformation')
        assert.equal(resultBufferOne[6], originManufacturerLatitude, 'Error: Missing or Invalid originManufacturerLatitude')
        assert.equal(resultBufferOne[7], originManufacturerLongitude, 'Error: Missing or Invalid originManufacturerLongitude')
        assert.equal(resultBufferTwo[3], productNotes, 'Error: Missing or Invalid productNotes')
        assert.equal(resultBufferTwo[4], productPrice, 'Error: Missing or Invalid productPrice')
        assert.equal(resultBufferTwo[5], stateReceived, 'Error: Invalid item State')        
        assert.equal(resultBufferTwo[6], distributorID, 'Error: Invalid distributorID')        
        assert.equal(resultBufferTwo[7], retailerID, 'Error: Invalid retailerID')        
        assert.equal(resultBufferTwo[8], emptyAddress, 'Error: Invalid consumerID')     
        assert.equal(eventEmitted, true, 'Invalid event emitted')
    })

    it("Testing smart contract function sellItem() that allows a retailer to sell a drug", async() => {
        
        // Declare and Initialize a variable for event
        var eventEmitted = false
        
        // Watch the emitted event Manufactured()
        var event = supplyChainContract.ForSale()
        await event.watch((err, res) => {
            eventEmitted = true
        })

        // Mark an item as Manufactured by calling function manufactureItem()
        await supplyChainContract.sellItem(upc, productPrice, {from: retailerID})

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChainContract.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChainContract.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], retailerID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originManufacturerID, 'Error: Missing or Invalid originManufacturerID')
        assert.equal(resultBufferOne[4], originManufacturerName, 'Error: Missing or Invalid originManufacturerName')
        assert.equal(resultBufferOne[5], originManufacturerInformation, 'Error: Missing or Invalid originManufacturerInformation')
        assert.equal(resultBufferOne[6], originManufacturerLatitude, 'Error: Missing or Invalid originManufacturerLatitude')
        assert.equal(resultBufferOne[7], originManufacturerLongitude, 'Error: Missing or Invalid originManufacturerLongitude')
        assert.equal(resultBufferTwo[3], productNotes, 'Error: Missing or Invalid productNotes')
        assert.equal(resultBufferTwo[4], productPrice, 'Error: Missing or Invalid productPrice')
        assert.equal(resultBufferTwo[5], stateForSale, 'Error: Invalid item State')        
        assert.equal(resultBufferTwo[6], distributorID, 'Error: Invalid distributorID')        
        assert.equal(resultBufferTwo[7], retailerID, 'Error: Invalid retailerID')        
        assert.equal(resultBufferTwo[8], emptyAddress, 'Error: Invalid consumerID')     
        assert.equal(eventEmitted, true, 'Invalid event emitted')
    })

    it("Testing smart contract function buyItem() that allows a consumer to buy a drug", async() => {
        
        // Declare and Initialize a variable for event
        var eventEmitted = false
        
        // Watch the emitted event Manufactured()
        var event = supplyChainContract.Sold()
        await event.watch((err, res) => {
            eventEmitted = true
        })

        // Mark an item as Manufactured by calling function manufactureItem()
        await supplyChainContract.buyItem(upc, {from: consumerID, value: productPrice})

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChainContract.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChainContract.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], consumerID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originManufacturerID, 'Error: Missing or Invalid originManufacturerID')
        assert.equal(resultBufferOne[4], originManufacturerName, 'Error: Missing or Invalid originManufacturerName')
        assert.equal(resultBufferOne[5], originManufacturerInformation, 'Error: Missing or Invalid originManufacturerInformation')
        assert.equal(resultBufferOne[6], originManufacturerLatitude, 'Error: Missing or Invalid originManufacturerLatitude')
        assert.equal(resultBufferOne[7], originManufacturerLongitude, 'Error: Missing or Invalid originManufacturerLongitude')
        assert.equal(resultBufferTwo[3], productNotes, 'Error: Missing or Invalid productNotes')
        assert.equal(resultBufferTwo[4], productPrice, 'Error: Missing or Invalid productPrice')
        assert.equal(resultBufferTwo[5], stateSold, 'Error: Invalid item State')        
        assert.equal(resultBufferTwo[6], distributorID, 'Error: Invalid distributorID')        
        assert.equal(resultBufferTwo[7], retailerID, 'Error: Invalid retailerID')        
        assert.equal(resultBufferTwo[8], consumerID, 'Error: Invalid consumerID')     
        assert.equal(eventEmitted, true, 'Invalid event emitted')
    })

    
    it("Testing smart contract function fetchItemBufferOne() that allows anyone to fetch item details from blockchain", async() => {
        

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChainContract.fetchItemBufferOne(upc)            
        
        // Verify the result set:            
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], consumerID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originManufacturerID, 'Error: Missing or Invalid originManufacturerID')
        assert.equal(resultBufferOne[4], originManufacturerName, 'Error: Missing or Invalid originManufacturerName')
        assert.equal(resultBufferOne[5], originManufacturerInformation, 'Error: Missing or Invalid originManufacturerInformation')
        assert.equal(resultBufferOne[6], originManufacturerLatitude, 'Error: Missing or Invalid originManufacturerLatitude')
        assert.equal(resultBufferOne[7], originManufacturerLongitude, 'Error: Missing or Invalid originManufacturerLongitude')
    })


    it("Testing smart contract function fetchItemBufferTwo() that allows anyone to fetch item details from blockchain", async() => {

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferTwo = await supplyChainContract.fetchItemBufferTwo.call(upc)
        
        // Verify the result set:
        assert.equal(resultBufferTwo[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferTwo[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferTwo[2], productID, 'Error: Missing or Invalid productID')
        assert.equal(resultBufferTwo[3], productNotes, 'Error: Missing or Invalid productNotes')
        assert.equal(resultBufferTwo[4], productPrice, 'Error: Missing or Invalid productPrice')
        assert.equal(resultBufferTwo[5], stateSold, 'Error: Invalid item state')
        assert.equal(resultBufferTwo[6], distributorID, 'Error: Missing or Invalid distributorID')
        assert.equal(resultBufferTwo[7], retailerID, 'Error: Missing or Invalid retailerID')
        assert.equal(resultBufferTwo[8], consumerID, 'Error: Missing or Invalid consumerID')                
    })

    
});
