$("#altin-al").submit(function (e) {
    var url = "altin-islem-al";
    var data = $("#altin-al").children(".form-group").eq(0).children("input").val();
    $.ajax({
        type: "POST",
        url: url,
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({ miktar: data }),
        success: function (data) {
            $("#satinalbasari").css("top", "10px");
            setTimeout(function () {
                $("#satinalbasari").css("top", "-200px");
            }, 2000);
        },
        error: function (err) {
            $("#satinalhata").css("top", "10px");
            setTimeout(function () {
                $("#satinalhata").css("top", "-200px");
            }, 2000);
        }
    });

    e.preventDefault();
});

$("#altin-sat").submit(function (e) {
    var url = "altin-islem-sat";
    var data = $("#altin-sat").children(".form-group").eq(0).children("input").val();
    $.ajax({
        type: "POST",
        url: url,
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({ miktar: data }),
        success: function (data) {
            if (data.status == 201) {
                $("#satbasari").css("top", "10px");
                setTimeout(function () {
                    $("#satbasari").css("top", "-200px");
                }, 2000);
            } else if (data.status == 409) {
                $("#sistemhata").css("top", "10px");
                setTimeout(function () {
                    $("#sistemhata").css("top", "-200px");
                }, 2000);
            }
        }
    });
    e.preventDefault();
});

$(".hayvan-al").submit(function (e) {
    var url = "hayvan-yem-al";
    var datas = $(this).children("input").val();
    var form = $(this);
    $.ajax({
        type: "POST",
        url: url,
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({ islem: datas }),
        success: function (data) {
            if (data.status == 201) {
                var mevcutSayi = parseInt(form.parent().children("p").children("span").text()) + 1;
                if (datas == "seed") mevcutSayi = parseInt(mevcutSayi) + 99;
                form.parent().children("p").children("span").text(mevcutSayi + " Adet");
                $("#albasari").css("top", "10px");
                setTimeout(function () {
                    $("#albasari").css("top", "-200px");
                }, 2000);
            } else if (data.status == 409) {
                $("#sistemhata").css("top", "10px");
                setTimeout(function () {
                    $("#sistemhata").css("top", "-200px");
                }, 2000);
            } else if (data.status == 101) {
                $("#alhata").css("top", "10px");
                setTimeout(function () {
                    $("#alhata").css("top", "-200px");
                }, 2000);
            }
        }
    });
    e.preventDefault();
});

$(".urun-sat").submit(function (e) {
    var url = "urun-sat";
    var data = $(this).children("input").val();
    var form = $(this);
    $.ajax({
        type: "POST",
        url: url,
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({ islem: data }),
        success: function (data) {
            if (data.status == 201) {
                form.parent().children("p").children("b").text("0");
                $("#satbasari").css("top", "10px");
                setTimeout(function () {
                    $("#satbasari").css("top", "-200px");
                }, 2000);
            } else if (data.status == 409) {
                $("#sistemhata").css("top", "10px");
                setTimeout(function () {
                    $("#sistemhata").css("top", "-200px");
                }, 2000);
            }
        }
    });
    e.preventDefault();
});