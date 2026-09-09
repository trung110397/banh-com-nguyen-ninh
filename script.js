// ========================================
// 1. CHẠY SAU KHI TRANG ĐÃ TẢI
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        // ========================================
        // 2. ĐỊNH DẠNG TIỀN
        // ========================================

        function dinhDangTien(soTien) {
            return Number(soTien)
                .toLocaleString("vi-VN") +
                " đồng";
        }


        // ========================================
        // 3. LẤY GIỎ HÀNG ĐÃ LƯU
        // ========================================

        let gioHang = [];

        try {
            gioHang =
                JSON.parse(
                    localStorage.getItem(
                        "gioHangBanh"
                    )
                ) || [];
        } catch (error) {
            gioHang = [];
        }

        function luuGioHang() {
            localStorage.setItem(
                "gioHangBanh",
                JSON.stringify(gioHang)
            );
        }


        // ========================================
        // 4. HIỂN THỊ GIỎ HÀNG
        // ========================================

        function hienThiGioHang() {
            const danhSach =
                document.getElementById(
                    "danh-sach-gio-hang"
                );

            const soLuongTrenMenu =
                document.getElementById(
                    "so-luong-gio-hang"
                );

            const tongTien =
                document.getElementById(
                    "tong-gio-hang"
                );

            const tongSoLuong =
                gioHang.reduce(
                    function (tong, sanPham) {
                        return (
                            tong +
                            sanPham.soLuong
                        );
                    },
                    0
                );

            const tongThanhTien =
                gioHang.reduce(
                    function (tong, sanPham) {
                        return (
                            tong +
                            sanPham.gia *
                            sanPham.soLuong
                        );
                    },
                    0
                );

            if (soLuongTrenMenu) {
                soLuongTrenMenu.textContent =
                    tongSoLuong;
            }

            if (tongTien) {
                tongTien.textContent =
                    dinhDangTien(
                        tongThanhTien
                    );
            }

            if (!danhSach) {
                return;
            }

            if (gioHang.length === 0) {
                danhSach.innerHTML =
                    "<p>Giỏ hàng đang trống.</p>";

                return;
            }

            danhSach.innerHTML =
                gioHang.map(
                    function (
                        sanPham,
                        viTri
                    ) {
                        return `
                            <div class="dong-gio-hang">

                                <div>
                                    <strong>
                                        ${lamSachVanBan(
                                            sanPham.ten
                                        )}
                                    </strong>

                                    <p>
                                        ${sanPham.soLuong}
                                        ×
                                        ${dinhDangTien(
                                            sanPham.gia
                                        )}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    class="nut-xoa-tung-san-pham"
                                    data-vi-tri="${viTri}"
                                >
                                    Xóa
                                </button>

                            </div>
                        `;
                    }
                ).join("");

            const cacNutXoa =
                document.querySelectorAll(
                    ".nut-xoa-tung-san-pham"
                );

            cacNutXoa.forEach(
                function (nut) {
                    nut.addEventListener(
                        "click",
                        function () {
                            const viTri =
                                Number(
                                    nut.dataset
                                        .viTri
                                );

                            gioHang.splice(
                                viTri,
                                1
                            );

                            luuGioHang();
                            hienThiGioHang();
                        }
                    );
                }
            );
        }


        // ========================================
        // 5. KẾT NỐI NÚT THÊM GIỎ
        // ========================================

        function ganSuKienNutThemGio() {
            const cacNutThemGio =
                document.querySelectorAll(
                    ".nut-them-gio"
                );

            cacNutThemGio.forEach(
                function (nut) {
                    if (
                        nut.dataset.daKetNoi ===
                        "true"
                    ) {
                        return;
                    }

                    nut.dataset.daKetNoi =
                        "true";

                    nut.addEventListener(
                        "click",
                        function () {
                            const ten =
                                nut.dataset.ten;

                            const gia =
                                Number(
                                    nut.dataset.gia
                                );

                            const idOsoLuong =
                                nut.dataset.input;

                            const oSoLuong =
                                document
                                    .getElementById(
                                        idOsoLuong
                                    );

                            const soLuong =
                                oSoLuong
                                    ? Math.max(
                                        1,
                                        Number(
                                            oSoLuong
                                                .value
                                        ) || 1
                                    )
                                    : 1;

                            const sanPhamDaCo =
                                gioHang.find(
                                    function (
                                        sanPham
                                    ) {
                                        return (
                                            sanPham.ten ===
                                                ten &&
                                            sanPham.gia ===
                                                gia
                                        );
                                    }
                                );

                            if (sanPhamDaCo) {
                                sanPhamDaCo
                                    .soLuong +=
                                    soLuong;
                            } else {
                                gioHang.push({
                                    ten: ten,
                                    gia: gia,
                                    soLuong:
                                        soLuong
                                });
                            }

                            luuGioHang();
                            hienThiGioHang();

                            alert(
                                "Đã thêm " +
                                ten +
                                " vào giỏ hàng."
                            );
                        }
                    );
                }
            );
        }


        // ========================================
        // 6. TÍNH TIỀN THEO SỐ LƯỢNG
        // ========================================

        function ganSuKienTinhTien() {
            const cacOSoLuong =
                document.querySelectorAll(
                    ".o-so-luong"
                );

            cacOSoLuong.forEach(
                function (oSoLuong) {
                    if (
                        oSoLuong.dataset
                            .daTinhTien ===
                        "true"
                    ) {
                        return;
                    }

                    oSoLuong.dataset
                        .daTinhTien =
                        "true";

                    function tinhTien() {
                        const gia =
                            Number(
                                oSoLuong.dataset
                                    .gia
                            );

                        const idKetQua =
                            oSoLuong.dataset
                                .ketqua;

                        const noiHienTien =
                            document
                                .getElementById(
                                    idKetQua
                                );

                        const soLuong =
                            Math.max(
                                1,
                                Number(
                                    oSoLuong.value
                                ) || 1
                            );

                        oSoLuong.value =
                            soLuong;

                        if (noiHienTien) {
                            noiHienTien
                                .textContent =
                                dinhDangTien(
                                    gia *
                                    soLuong
                                );
                        }
                    }

                    oSoLuong.addEventListener(
                        "input",
                        tinhTien
                    );

                    oSoLuong.addEventListener(
                        "change",
                        tinhTien
                    );

                    tinhTien();
                }
            );
        }


        // ========================================
        // 7. XÓA TOÀN BỘ GIỎ HÀNG
        // ========================================

        const nutXoaGio =
            document.getElementById(
                "nut-xoa-gio"
            );

        if (nutXoaGio) {
            nutXoaGio.addEventListener(
                "click",
                function () {
                    if (
                        gioHang.length === 0
                    ) {
                        alert(
                            "Giỏ hàng đang trống."
                        );

                        return;
                    }

                    const dongYXoa =
                        confirm(
                            "Bạn có muốn xóa toàn bộ giỏ hàng không?"
                        );

                    if (!dongYXoa) {
                        return;
                    }

                    gioHang = [];

                    luuGioHang();
                    hienThiGioHang();
                }
            );
        }


        // ========================================
        // 8. TẠO NỘI DUNG ĐƠN HÀNG
        // ========================================

        function taoNoiDungDonHang() {
            if (gioHang.length === 0) {
                return "";
            }

            const tenKhach =
                document.getElementById(
                    "ten-khach-hang"
                );

            const dienThoai =
                document.getElementById(
                    "dien-thoai"
                );

            const diaChi =
                document.getElementById(
                    "dia-chi"
                );

            const ghiChu =
                document.getElementById(
                    "ghi-chu"
                );

            let noiDung =
                "ĐƠN ĐẶT BÁNH\n\n";

            if (tenKhach) {
                noiDung +=
                    "Khách hàng: " +
                    tenKhach.value.trim() +
                    "\n";
            }

            if (dienThoai) {
                noiDung +=
                    "Điện thoại: " +
                    dienThoai.value.trim() +
                    "\n";
            }

            if (diaChi) {
                noiDung +=
                    "Địa chỉ: " +
                    diaChi.value.trim() +
                    "\n";
            }

            noiDung += "\nSản phẩm:\n";

            let tongTien = 0;

            gioHang.forEach(
                function (
                    sanPham,
                    viTri
                ) {
                    const thanhTien =
                        sanPham.gia *
                        sanPham.soLuong;

                    tongTien +=
                        thanhTien;

                    noiDung +=
                        (viTri + 1) +
                        ". " +
                        sanPham.ten +
                        " - " +
                        sanPham.soLuong +
                        " phần - " +
                        dinhDangTien(
                            thanhTien
                        ) +
                        "\n";
                }
            );

            noiDung +=
                "\nTổng cộng: " +
                dinhDangTien(tongTien);

            if (
                ghiChu &&
                ghiChu.value.trim()
            ) {
                noiDung +=
                    "\nGhi chú: " +
                    ghiChu.value.trim();
            }

            return noiDung;
        }


        // ========================================
        // 9. SAO CHÉP ĐƠN HÀNG
        // ========================================

        const nutSaoChep =
            document.getElementById(
                "nut-sao-chep-don"
            );

        if (nutSaoChep) {
            nutSaoChep.addEventListener(
                "click",
                async function () {
                    const noiDung =
                        taoNoiDungDonHang();

                    if (!noiDung) {
                        alert(
                            "Giỏ hàng đang trống. Hãy thêm sản phẩm trước."
                        );

                        return;
                    }

                    try {
                        await navigator
                            .clipboard
                            .writeText(
                                noiDung
                            );

                        alert(
                            "Đã sao chép đơn hàng."
                        );
                    } catch (error) {
                        alert(
                            "Không sao chép được. Hãy thử lại."
                        );
                    }
                }
            );
        }


        // ========================================
        // 10. BIỂU MẪU ĐẶT HÀNG
        // ========================================

        const formDatHang =
            document.getElementById(
                "form-dat-hang"
            );

        if (formDatHang) {
            formDatHang.addEventListener(
                "submit",
                function (suKien) {
                    suKien.preventDefault();

                    if (
                        gioHang.length === 0
                    ) {
                        alert(
                            "Bạn chưa thêm sản phẩm vào giỏ hàng."
                        );

                        return;
                    }

                    const noiDung =
                        taoNoiDungDonHang();

                    const noiHienDon =
                        document.getElementById(
                            "noi-dung-don-hang"
                        );

                    if (noiHienDon) {
                        noiHienDon.textContent =
                            noiDung;

                        noiHienDon.classList
                            .remove("an");
                    }

                    const khuVucGio =
                        document.getElementById(
                            "gio-hang"
                        );

                    if (khuVucGio) {
                        khuVucGio.scrollIntoView({
                            behavior: "smooth"
                        });
                    }
                }
            );
        }


        // ========================================
        // 11. PHÓNG TO ẢNH
        // ========================================

        const cuaSoAnh =
            document.getElementById(
                "cua-so-anh"
            );

        const anhPhongTo =
            document.getElementById(
                "anh-phong-to"
            );

        const nutDongAnh =
            document.getElementById(
                "dong-cua-so-anh"
            );

        function ganSuKienPhongToAnh() {
            const cacAnhSanPham =
                document.querySelectorAll(
                    ".anh-san-pham"
                );

            cacAnhSanPham.forEach(
                function (anh) {
                    if (
                        anh.dataset
                            .daPhongTo ===
                        "true"
                    ) {
                        return;
                    }

                    anh.dataset.daPhongTo =
                        "true";

                    anh.addEventListener(
                        "click",
                        function () {
                            if (
                                !cuaSoAnh ||
                                !anhPhongTo
                            ) {
                                return;
                            }

                            anhPhongTo.src =
                                anh.src;

                            anhPhongTo.alt =
                                anh.alt;

                            cuaSoAnh.classList
                                .add("hien");
                        }
                    );
                }
            );
        }

        function dongCuaSoAnh() {
            if (cuaSoAnh) {
                cuaSoAnh.classList.remove(
                    "hien"
                );
            }
        }

        if (nutDongAnh) {
            nutDongAnh.addEventListener(
                "click",
                dongCuaSoAnh
            );
        }

        if (cuaSoAnh) {
            cuaSoAnh.addEventListener(
                "click",
                function (suKien) {
                    if (
                        suKien.target ===
                        cuaSoAnh
                    ) {
                        dongCuaSoAnh();
                    }
                }
            );
        }

        document.addEventListener(
            "keydown",
            function (suKien) {
                if (
                    suKien.key ===
                    "Escape"
                ) {
                    dongCuaSoAnh();
                }
            }
        );


        // ========================================
        // 12. NÚT LÊN ĐẦU TRANG
        // ========================================

        const nutLenDau =
            document.getElementById(
                "nut-len-dau"
            );

        window.addEventListener(
            "scroll",
            function () {
                if (!nutLenDau) {
                    return;
                }

                if (
                    window.scrollY > 400
                ) {
                    nutLenDau.classList
                        .add("hien");
                } else {
                    nutLenDau.classList
                        .remove("hien");
                }
            }
        );

        if (nutLenDau) {
            nutLenDau.addEventListener(
                "click",
                function () {
                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });
                }
            );
        }


        // ========================================
        // 13. CHẾ ĐỘ SÁNG/TỐI
        // ========================================

        const nutDoiGiaoDien =
            document.getElementById(
                "nut-doi-giao-dien"
            );

        const giaoDienDaLuu =
            localStorage.getItem(
                "giaoDienBanh"
            );

        if (
            giaoDienDaLuu === "toi"
        ) {
            document.body.classList.add(
                "che-do-toi"
            );

            if (nutDoiGiaoDien) {
                nutDoiGiaoDien.textContent =
                    "☀️";
            }
        }

        if (nutDoiGiaoDien) {
            nutDoiGiaoDien.addEventListener(
                "click",
                function () {
                    document.body
                        .classList
                        .toggle(
                            "che-do-toi"
                        );

                    const dangToi =
                        document.body
                            .classList
                            .contains(
                                "che-do-toi"
                            );

                    nutDoiGiaoDien
                        .textContent =
                        dangToi
                            ? "☀️"
                            : "🌙";

                    localStorage.setItem(
                        "giaoDienBanh",
                        dangToi
                            ? "toi"
                            : "sang"
                    );
                }
            );
        }


        // ========================================
        // 14. HIỆU ỨNG CUỘN
        // ========================================

        const cacPhanHieuUng =
            document.querySelectorAll(
                ".hieu-ung-cuon"
            );

        if (
            "IntersectionObserver" in
            window
        ) {
            const boTheoDoi =
                new IntersectionObserver(
                    function (cacMuc) {
                        cacMuc.forEach(
                            function (muc) {
                                if (
                                    muc.isIntersecting
                                ) {
                                    muc.target
                                        .classList
                                        .add(
                                            "da-hien"
                                        );

                                    boTheoDoi
                                        .unobserve(
                                            muc.target
                                        );
                                }
                            }
                        );
                    },
                    {
                        threshold: 0.15
                    }
                );

            cacPhanHieuUng.forEach(
                function (phan) {
                    boTheoDoi.observe(
                        phan
                    );
                }
            );
        } else {
            cacPhanHieuUng.forEach(
                function (phan) {
                    phan.classList.add(
                        "da-hien"
                    );
                }
            );
        }


        // ========================================
        // 15. CUỘN MƯỢT CHO MENU
        // ========================================

        const cacLienKetNoiBo =
            document.querySelectorAll(
                'a[href^="#"]'
            );

        cacLienKetNoiBo.forEach(
            function (lienKet) {
                lienKet.addEventListener(
                    "click",
                    function (suKien) {
                        const idDich =
                            lienKet
                                .getAttribute(
                                    "href"
                                );

                        if (
                            !idDich ||
                            idDich === "#"
                        ) {
                            return;
                        }

                        const phanCanDen =
                            document
                                .querySelector(
                                    idDich
                                );

                        if (phanCanDen) {
                            suKien
                                .preventDefault();

                            phanCanDen
                                .scrollIntoView({
                                    behavior:
                                        "smooth",
                                    block:
                                        "start"
                                });
                        }
                    }
                );
            }
        );


        // ========================================
        // 16. LÀM SẠCH VĂN BẢN
        // ========================================

        function lamSachVanBan(
            noiDung
        ) {
            const oTam =
                document.createElement(
                    "div"
                );

            oTam.textContent =
                String(
                    noiDung ?? ""
                );

            return oTam.innerHTML;
        }


        // ========================================
        // 17. KẾT NỐI SẢN PHẨM CÓ SẴN
        // ========================================

        ganSuKienNutThemGio();
        ganSuKienTinhTien();
        ganSuKienPhongToAnh();
        hienThiGioHang();


        // ========================================
        // 18. KẾT NỐI SẢN PHẨM TỪ ADMIN
        // ========================================

        document.addEventListener(
            "sanPhamDaTai",
            function () {
                ganSuKienNutThemGio();
                ganSuKienTinhTien();
                ganSuKienPhongToAnh();
            }
        );

    }
);