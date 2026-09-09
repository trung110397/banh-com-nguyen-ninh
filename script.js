document.addEventListener("DOMContentLoaded", function () {

    // ========================================
    // 1. HÀM DÙNG CHUNG
    // ========================================

    function dinhDangTien(soTien) {
        return Number(soTien)
            .toLocaleString("vi-VN") +
            " đồng";
    }

    function lamSachVanBan(noiDung) {
        const oTam =
            document.createElement("div");

        oTam.textContent =
            String(noiDung ?? "");

        return oTam.innerHTML;
    }


    // ========================================
    // 2. GIỎ HÀNG
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
                    return tong +
                        sanPham.soLuong;
                },
                0
            );

        const tongThanhTien =
            gioHang.reduce(
                function (tong, sanPham) {
                    return tong +
                        sanPham.gia *
                        sanPham.soLuong;
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
                function (sanPham, viTri) {
                    const thanhTien =
                        sanPham.gia *
                        sanPham.soLuong;

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

                                <p>
                                    Thành tiền:
                                    <strong>
                                        ${dinhDangTien(
                                            thanhTien
                                        )}
                                    </strong>
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

        document
            .querySelectorAll(
                ".nut-xoa-tung-san-pham"
            )
            .forEach(function (nut) {
                nut.addEventListener(
                    "click",
                    function () {
                        const viTri =
                            Number(
                                nut.dataset.viTri
                            );

                        gioHang.splice(
                            viTri,
                            1
                        );

                        luuGioHang();
                        hienThiGioHang();
                    }
                );
            });
    }


    // ========================================
    // 3. NÚT TĂNG GIẢM SỐ LƯỢNG
    // ========================================

    function taoNutTangGiamSoLuong() {
        const cacOSoLuong =
            document.querySelectorAll(
                ".o-so-luong"
            );

        cacOSoLuong.forEach(
            function (oSoLuong) {
                if (
                    oSoLuong.dataset
                        .daCoNutTangGiam ===
                    "true"
                ) {
                    return;
                }

                oSoLuong.dataset
                    .daCoNutTangGiam =
                    "true";

                const khung =
                    document.createElement(
                        "div"
                    );

                khung.className =
                    "bo-chon-so-luong";

                const nutGiam =
                    document.createElement(
                        "button"
                    );

                nutGiam.type = "button";
                nutGiam.className =
                    "nut-so-luong";
                nutGiam.textContent = "−";

                const nutTang =
                    document.createElement(
                        "button"
                    );

                nutTang.type = "button";
                nutTang.className =
                    "nut-so-luong";
                nutTang.textContent = "+";

                nutGiam.setAttribute(
                    "aria-label",
                    "Giảm số lượng"
                );

                nutTang.setAttribute(
                    "aria-label",
                    "Tăng số lượng"
                );

                oSoLuong.parentNode
                    .insertBefore(
                        khung,
                        oSoLuong
                    );

                khung.appendChild(nutGiam);
                khung.appendChild(oSoLuong);
                khung.appendChild(nutTang);

                nutGiam.addEventListener(
                    "click",
                    function () {
                        oSoLuong.value =
                            Math.max(
                                1,
                                Number(
                                    oSoLuong.value ||
                                    1
                                ) - 1
                            );

                        oSoLuong.dispatchEvent(
                            new Event("input")
                        );
                    }
                );

                nutTang.addEventListener(
                    "click",
                    function () {
                        oSoLuong.value =
                            Math.max(
                                1,
                                Number(
                                    oSoLuong.value ||
                                    1
                                ) + 1
                            );

                        oSoLuong.dispatchEvent(
                            new Event("input")
                        );
                    }
                );
            }
        );
    }


    // ========================================
    // 4. TÍNH TIỀN
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
                        document.getElementById(
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
                        noiHienTien.textContent =
                            dinhDangTien(
                                gia * soLuong
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
    // 5. THÊM VÀO GIỎ
    // ========================================

    function ganSuKienNutThemGio() {
        const cacNutThemGio =
            document.querySelectorAll(
                ".nut-them-gio"
            );

        cacNutThemGio.forEach(
            function (nut) {
                if (
                    nut.dataset
                        .daKetNoi ===
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

                        const oSoLuong =
                            document
                                .getElementById(
                                    nut.dataset
                                        .input
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
    // 6. XÓA GIỎ HÀNG
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

                if (
                    !confirm(
                        "Bạn có muốn xóa toàn bộ giỏ hàng không?"
                    )
                ) {
                    return;
                }

                gioHang = [];

                luuGioHang();
                hienThiGioHang();
            }
        );
    }


    // ========================================
    // 7. TẠO NỘI DUNG ĐƠN
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

        noiDung +=
            "Khách hàng: " +
            (tenKhach?.value.trim() || "") +
            "\n";

        noiDung +=
            "Điện thoại: " +
            (dienThoai?.value.trim() || "") +
            "\n";

        noiDung +=
            "Địa chỉ: " +
            (diaChi?.value.trim() || "") +
            "\n\nSản phẩm:\n";

        let tongTien = 0;

        gioHang.forEach(
            function (sanPham, viTri) {
                const thanhTien =
                    sanPham.gia *
                    sanPham.soLuong;

                tongTien += thanhTien;

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
    // 8. SAO CHÉP ĐƠN
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
                        "Giỏ hàng đang trống."
                    );
                    return;
                }

                try {
                    await navigator
                        .clipboard
                        .writeText(noiDung);

                    alert(
                        "Đã sao chép đơn hàng."
                    );
                } catch (error) {
                    alert(
                        "Không sao chép được."
                    );
                }
            }
        );
    }


    // ========================================
    // 9. BIỂU MẪU ĐẶT HÀNG
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
                        "Bạn chưa thêm sản phẩm vào giỏ."
                    );
                    return;
                }

                const noiHienDon =
                    document.getElementById(
                        "noi-dung-don-hang"
                    );

                if (noiHienDon) {
                    noiHienDon.textContent =
                        taoNoiDungDonHang();

                    noiHienDon.classList
                        .remove("an");
                }

                document
                    .getElementById(
                        "gio-hang"
                    )
                    ?.scrollIntoView({
                        behavior: "smooth"
                    });
            }
        );
    }


    // ========================================
    // 10. PHÓNG TO ẢNH
    // ========================================

    const cuaSoAnh =
        document.getElementById(
            "cua-so-anh"
        );

    const anhPhongTo =
        document.getElementById(
            "anh-phong-to"
        );

    function ganSuKienPhongToAnh() {
        document
            .querySelectorAll(
                ".anh-san-pham"
            )
            .forEach(function (anh) {
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
            });
    }

    function dongCuaSoAnh() {
        cuaSoAnh?.classList.remove(
            "hien"
        );
    }

    document
        .getElementById(
            "dong-cua-so-anh"
        )
        ?.addEventListener(
            "click",
            dongCuaSoAnh
        );

    cuaSoAnh?.addEventListener(
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

    document.addEventListener(
        "keydown",
        function (suKien) {
            if (
                suKien.key === "Escape"
            ) {
                dongCuaSoAnh();
            }
        }
    );


    // ========================================
    // 11. NÚT LÊN ĐẦU
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

            nutLenDau.classList.toggle(
                "hien",
                window.scrollY > 400
            );
        }
    );

    nutLenDau?.addEventListener(
        "click",
        function () {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    );


    // ========================================
    // 12. CHẾ ĐỘ SÁNG/TỐI
    // ========================================

    const nutDoiGiaoDien =
        document.getElementById(
            "nut-doi-giao-dien"
        );

    if (
        localStorage.getItem(
            "giaoDienBanh"
        ) === "toi"
    ) {
        document.body.classList.add(
            "che-do-toi"
        );

        if (nutDoiGiaoDien) {
            nutDoiGiaoDien.textContent =
                "☀️";
        }
    }

    nutDoiGiaoDien?.addEventListener(
        "click",
        function () {
            document.body.classList
                .toggle("che-do-toi");

            const dangToi =
                document.body.classList
                    .contains(
                        "che-do-toi"
                    );

            nutDoiGiaoDien.textContent =
                dangToi ? "☀️" : "🌙";

            localStorage.setItem(
                "giaoDienBanh",
                dangToi ? "toi" : "sang"
            );
        }
    );


    // ========================================
    // 13. HIỆU ỨNG CUỘN
    // ========================================

    const cacPhanHieuUng =
        document.querySelectorAll(
            ".hieu-ung-cuon"
        );

    if (
        "IntersectionObserver" in window
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
                    threshold: 0.02
                }
            );

        cacPhanHieuUng.forEach(
            function (phan) {
                boTheoDoi.observe(phan);
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
    // 14. CUỘN MƯỢT MENU
    // ========================================

    document
        .querySelectorAll(
            'a[href^="#"]'
        )
        .forEach(function (lienKet) {
            lienKet.addEventListener(
                "click",
                function (suKien) {
                    const idDich =
                        lienKet.getAttribute(
                            "href"
                        );

                    if (
                        !idDich ||
                        idDich === "#"
                    ) {
                        return;
                    }

                    const phanCanDen =
                        document.querySelector(
                            idDich
                        );

                    if (phanCanDen) {
                        suKien.preventDefault();

                        phanCanDen
                            .scrollIntoView({
                                behavior:
                                    "smooth"
                            });
                    }
                }
            );
        });


    // ========================================
    // 15. KẾT NỐI SẢN PHẨM
    // ========================================

    function ketNoiSanPham() {
        taoNutTangGiamSoLuong();
        ganSuKienTinhTien();
        ganSuKienNutThemGio();
        ganSuKienPhongToAnh();
    }

    ketNoiSanPham();
    hienThiGioHang();

    // Sản phẩm từ admin tải xong
    document.addEventListener(
        "sanPhamDaTai",
        ketNoiSanPham
    );

});