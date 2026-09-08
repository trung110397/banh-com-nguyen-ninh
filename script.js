function tinhTienXuXe() {
    const oSoLuong = document.getElementById("so-luong-xu-xe");
    let soLuong = parseInt(oSoLuong.value);

    if (!soLuong || soLuong < 1) {
        soLuong = 1;
        oSoLuong.value = 1;
    }

    const giaMotPhan = 60000;
    const tongTien = soLuong * giaMotPhan;

    document.getElementById("tong-tien-xu-xe").textContent =
        tongTien.toLocaleString("vi-VN") + " đồng";
}
function tinhTienBanhCom() {
    const oLoaiBanh = document.getElementById("loai-banh-com");
    const oSoLuong = document.getElementById("so-luong-banh-com");

    const giaMotPhan = parseInt(oLoaiBanh.value);
    let soLuong = parseInt(oSoLuong.value);

    if (!soLuong || soLuong < 1) {
        soLuong = 1;
        oSoLuong.value = 1;
    }

    const tongTien = giaMotPhan * soLuong;

    document.getElementById("tong-tien-banh-com").textContent =
        tongTien.toLocaleString("vi-VN") + " đồng";
}
let gioHang = [];

function themXuXeVaoGio() {
    const oSoLuong = document.getElementById("so-luong-xu-xe");
    let soLuong = parseInt(oSoLuong.value);

    if (!soLuong || soLuong < 1) {
        soLuong = 1;
        oSoLuong.value = 1;
    }

    const thanhTien = soLuong * 60000;

    gioHang.push({
        ten: "Bánh xu xê",
        soLuong: soLuong,
        thanhTien: thanhTien
    });

    hienThiGioHang();

    document.getElementById("gio-hang").scrollIntoView({
        behavior: "smooth"
    });
}

function hienThiGioHang() {
    const noiDung = document.getElementById("noi-dung-gio-hang");
    const tongGioHang = document.getElementById("tong-gio-hang");

    noiDung.innerHTML = "";

    let tongTien = 0;

    gioHang.forEach(function (sanPham) {
        noiDung.innerHTML +=
            "<p>" +
            sanPham.ten +
            " – " +
            sanPham.soLuong +
            " phần: <strong>" +
            sanPham.thanhTien.toLocaleString("vi-VN") +
            " đồng</strong></p>";

        tongTien += sanPham.thanhTien;
    });

    tongGioHang.textContent =
        tongTien.toLocaleString("vi-VN") + " đồng";
}
function themBanhComVaoGio() {
    const oLoaiBanh = document.getElementById("loai-banh-com");
    const oSoLuong = document.getElementById("so-luong-banh-com");

    const giaMotPhan = parseInt(oLoaiBanh.value);
    let soLuong = parseInt(oSoLuong.value);

    if (!soLuong || soLuong < 1) {
        soLuong = 1;
        oSoLuong.value = 1;
    }

    let tenSanPham = "Bánh cốm nhỏ";

    if (giaMotPhan === 80000) {
        tenSanPham = "Bánh cốm lớn";
    }

    const thanhTien = giaMotPhan * soLuong;

    gioHang.push({
        ten: tenSanPham,
        soLuong: soLuong,
        thanhTien: thanhTien
    });

    hienThiGioHang();

    document.getElementById("gio-hang").scrollIntoView({
        behavior: "smooth"
    });
}
function xoaGioHang() {
    const dongY = confirm("Bạn có chắc muốn xóa toàn bộ giỏ hàng không?");

    if (!dongY) {
        return;
    }

    gioHang = [];

    document.getElementById("noi-dung-gio-hang").innerHTML =
        "<p>Chưa có sản phẩm.</p>";

    document.getElementById("tong-gio-hang").textContent =
        "0 đồng";
}
function saoChepDonHang() {
    if (gioHang.length === 0) {
        alert("Giỏ hàng đang trống.");
        return;
    }

    let noiDung = "ĐƠN HÀNG BÁNH NGUYÊN NINH\n";
    let tongTien = 0;

    gioHang.forEach(function (sanPham) {
        noiDung +=
            "- " +
            sanPham.ten +
            ": " +
            sanPham.soLuong +
            " phần – " +
            sanPham.thanhTien.toLocaleString("vi-VN") +
            " đồng\n";

        tongTien += sanPham.thanhTien;
    });

    noiDung +=
        "Tổng cộng: " +
        tongTien.toLocaleString("vi-VN") +
        " đồng";

    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(noiDung).then(function () {
            alert("Đã sao chép đơn hàng.");
        });
    } else {
        const oTam = document.createElement("textarea");
        oTam.value = noiDung;
        document.body.appendChild(oTam);
        oTam.select();
        document.execCommand("copy");
        document.body.removeChild(oTam);

        alert("Đã sao chép đơn hàng.");
    }
}