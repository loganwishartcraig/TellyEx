$(document).ready(function() {
    $(".pullup").hover(function() {
        $(this).css("height", "92%")
        abortTimer()
    }, function() {
        $(this).css("height", "40px")
    })

    var tid = setInterval(function() {
        wigglePull()
    }, 5000)

    function setTimer() {
        tid = setInterval(function() {
            wigglePull()
        }, 7500)

    }

    function abortTimer() {
        clearInterval(tid)
    }

    function wigglePull() {
        $(".pullup").css("height", "50px")
        window.setTimeout(function() {
            $(".pullup").css("height", "40px")
        }, 150)

    }


    var order = {
        model: 0,
        issues: {
            qkScrn: 0,
            qkPwr: 0,
            qkBatt: 0,
            qkIcld: 0
        }
    };

    var SERVICE_COST = 75;


    var highlightColor = "#f9a21c"
    var baseColor = "#f2f2f2"
    var resetBorder = 'transparent'

    var dmgSelected = false;



    $('.pull-model, .pull-dmg').hover(function() {

        $(this).css('border-color', highlightColor)
        $(this).css('color', highlightColor)

        $(this).children('span').css('color', highlightColor)

    }, function() {

        if (!($(this).hasClass('pull-selected'))) {

            $(this).css('border-color', resetBorder)
            $(this).css('color', baseColor)

            $(this).children('span').css('color', baseColor)

        }

    })



    $('.pull-model').click(function() {

        if (order.model === 0) {

            order.model = $(this).data('val')
            $(this).addClass('pull-selected')

            if (dmgSelected)
                $('#cashVal').html("$".concat(calcPrice()))

        } else {

            if (!(order.model === $(this).data('val'))) {

                $(this).siblings('.pull-selected').css('border-color', resetBorder)
                $(this).siblings('.pull-selected').css('color', baseColor)
                $(this).siblings('.pull-selected').removeClass('pull-selected')

                $(this).addClass('pull-selected')
                order.model = $(this).data('val')

                if ((order.model != 0) && ($(".pull-selected").length > 1)) {
                    console.log()
                    setPrice($("#cashVal"))
                } else {
                    $("#cashVal").html("<-----")
                }

            }

            console.log(order)
        }
    })


    $('.pull-dmg').click(function() {


        if ($(this).hasClass('pull-selected')) {

            order.issues[$(this).data("attr")] = 0

            $(this).css('border-color', resetBorder)
            $(this).removeClass('pull-selected')

            dmgSelected = false


        } else {

            order.issues[$(this).data("attr")] = $(this).data("val")

            $(this).css('border-color', highlightColor)
            $(this).css('color', highlightColor)
            $(this).addClass('pull-selected')

            dmgSelected = true


        }

        if ((order.model != 0) && ($(".pull-selected").length > 1)) {
            console.log()
            setPrice($("#cashVal"))
        } else {
            $("#cashVal").html("<-----")
        }

    })




    var priceList = {
        1: {
            basePrice: 230,
            minPrice: 230 / 4,
            qkScrn: 40,
            qkPwr: 100,
            qkBatt: 15,
            qkIcld: 100
        },
        2: {
            basePrice: 300,
            minPrice: 300 / 4.25,
            qkScrn: 50,
            qkPwr: 150,
            qkBatt: 15,
            qkIcld: 150
        },
        3: {
            basePrice: 600,
            minPrice: 600 / 4.5,
            qkScrn: 130,
            qkPwr: 300,
            qkBatt: 20,
            qkIcld: 300
        },
        4: {
            basePrice: 680,
            minPrice: 680 / 4.75,
            qkScrn: 150,
            qkPwr: 330,
            qkBatt: 20,
            qkIcld: 330
        }
    }

    function setPrice(node) {

        var priceFloor = Math.round(priceList[order.model].minPrice);
        var priceOffer = calcPrice();

        if (priceOffer < priceFloor) {
            node.html("$".concat(priceFloor))
        } else {
            node.html("$".concat(priceOffer))
        }

    }

    function calcPrice() {

        var basePrice = priceList[order.model]['basePrice']
        var dmgCost = 0

        for (var key in order.issues) {

            if (order.issues.hasOwnProperty(key)) {
                if (order.issues[key] === 1) {

                    dmgCost += priceList[order.model][key]

                }
            }

        }

        if (dmgCost === 0) {
            return 0
        } else {

            var total = basePrice - dmgCost - SERVICE_COST

            return total

        }

    }


    function calcMinPrice() {

        var partsValue = 0;

        for (var key in order.issues) {

            if (order.issues.hasOwnProperty(key)) {
                if (order.issues[key] === 0) {
                    console.log(key)
                }
            }

        }

    }

});
