// ========================================
// 1. KẾT NỐI SUPABASE
// ========================================

// Thay bằng Project URL của bạn
const SUPABASE_URL =
    "https://nfdovcuvgdmdhynhuhxy.supabase.co";

// Thay bằng Publishable key của bạn
const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_g4fa73qmE0k9nd9TUNTlpg_88X1DgfV";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


// ========================================
// 2. LẤY CÁC PHẦN TỬ HTML
// ========================================

const khuVucDangNhap =
    document.getElementById("khu-vuc-dang-nhap");

const khuVucQuanLy =
    document.getElementById("khu-vuc-quan-ly");

const formDangNhap =
    document.getElementById("form-dang-nhap");

const thongBaoDangNhap =
    document.getElementById("thong-bao-dang-nhap");

const nutDangXuat =
    document.getElementById("nut-dang-xuat");

const formSanPham =
    document.getElementById("form-san-pham");

const thongBaoSanPham =
    document.getElementById("thong-bao-san-pham");

const oChonAnh =
    document.getElementById("anh-san-pham");

const anhXemTruoc =
    document.getElementById("anh-xem-truoc");

const danhSachQuanLy =
    document.getElementById("danh-sach-quan-ly");

const nutHuySua =
    document.getElementById("nut-huy-sua");

const oTimSanPham =
    document.getElementById("tim-san-pham");

const oLocTrangThai =
    document.getElementById("loc-trang-thai");

const oTongSanPham =
    document.getElementById("tong-san-pham");

const oSanPhamDangBan =
    document.getElementById("san-pham-dang-ban");

const oSanPhamDangAn =
    document.getElementById("san-pham-dang-an");


// ========================================
// 3. HIỆN TRANG ĐĂNG NHẬP/QUẢN LÝ
// ========================================

function hienTrangQuanLy() {
    khuVucDangNhap.classList.add("an");
    khuVucQuanLy.classList.remove("an");

    taiDanhSachSanPham();
}

function hienTrangDangNhap() {
    khuVucQuanLy.classList.add("an");
    khuVucDangNhap.classList.remove("an");
}


// ========================================
// 4. ĐĂNG NHẬP ADMIN
// ========================================

formDangNhap.addEventListener(
    "submit",
    async function (suKien) {
        suKien.preventDefault();

        const email = document
            .getElementById("email-admin")
            .value
            .trim();

        const matKhau = document
            .getElementById("mat-khau-admin")
            .value;

        thongBaoDangNhap.textContent =
            "Đang đăng nhập...";

        thongBaoDangNhap.style.color =
            "#555555";

        const { error } =
            await supabaseClient.auth
                .signInWithPassword({
                    email: email,
                    password: matKhau
                });

        if (error) {
            thongBaoDangNhap.textContent =
                "Đăng nhập không thành công: " +
                dichLoiDangNhap(error.message);

            thongBaoDangNhap.style.color =
                "#c0392b";

            return;
        }

        thongBaoDangNhap.textContent = "";
        formDangNhap.reset();

        hienTrangQuanLy();
    }
);


// ========================================
// 5. DỊCH LỖI ĐĂNG NHẬP
// ========================================

function dichLoiDangNhap(loi) {
    const noiDungLoi =
        String(loi).toLowerCase();

    if (
        noiDungLoi.includes(
            "invalid login credentials"
        )
    ) {
        return "Email hoặc mật khẩu không đúng.";
    }

    if (
        noiDungLoi.includes(
            "email not confirmed"
        )
    ) {
        return "Email chưa được xác nhận.";
    }

    return loi;
}


// ========================================
// 6. ĐĂNG XUẤT
// ========================================

nutDangXuat.addEventListener(
    "click",
    async function () {
        nutDangXuat.disabled = true;
        nutDangXuat.textContent =
            "Đang đăng xuất...";

        const { error } =
            await supabaseClient.auth.signOut();

        nutDangXuat.disabled = false;
        nutDangXuat.textContent =
            "Đăng xuất";

        if (error) {
            alert(
                "Không đăng xuất được: " +
                error.message
            );

            return;
        }

        huyCheDoSua();
        hienTrangDangNhap();
    }
);


// ========================================
// 7. KIỂM TRA PHIÊN ĐĂNG NHẬP
// ========================================

async function kiemTraDangNhap() {
    const { data, error } =
        await supabaseClient.auth.getSession();

    if (error || !data.session) {
        hienTrangDangNhap();
        return;
    }

    hienTrangQuanLy();
}

kiemTraDangNhap();


// ========================================
// 8. XEM TRƯỚC ẢNH
// ========================================

let duongDanAnhTam = null;

oChonAnh.addEventListener(
    "change",
    function () {
        const tepAnh =
            oChonAnh.files[0];

        if (duongDanAnhTam) {
            URL.revokeObjectURL(
                duongDanAnhTam
            );

            duongDanAnhTam = null;
        }

        if (!tepAnh) {
            anhXemTruoc.src = "";
            anhXemTruoc.classList.add("an");

            return;
        }

        if (!tepAnh.type.startsWith("image/")) {
            hienLoiSanPham(
                "Tệp đã chọn không phải là ảnh."
            );

            oChonAnh.value = "";
            return;
        }

        if (tepAnh.size > 5 * 1024 * 1024) {
            hienLoiSanPham(
                "Ảnh phải nhỏ hơn 5 MB."
            );

            oChonAnh.value = "";
            return;
        }

        duongDanAnhTam =
            URL.createObjectURL(tepAnh);

        anhXemTruoc.src =
            duongDanAnhTam;

        anhXemTruoc.classList.remove("an");

        thongBaoSanPham.textContent = "";
    }
);


// ========================================
// 9. THÊM HOẶC SỬA SẢN PHẨM
// ========================================

formSanPham.addEventListener(
    "submit",
    async function (suKien) {
        suKien.preventDefault();

        const idSua =
            formSanPham.dataset.idSua;

        const ten = document
            .getElementById("ten-san-pham")
            .value
            .trim();

        const gia = Number(
            document
                .getElementById("gia-san-pham")
                .value
        );

        const soBanh = Number(
            document
                .getElementById("so-banh")
                .value
        );

        const moTa = document
            .getElementById("mo-ta-san-pham")
            .value
            .trim();

        const tepAnh =
            oChonAnh.files[0];

        if (!ten) {
            hienLoiSanPham(
                "Vui lòng nhập tên sản phẩm."
            );

            return;
        }

        if (
            !Number.isFinite(gia) ||
            gia <= 0
        ) {
            hienLoiSanPham(
                "Giá sản phẩm phải lớn hơn 0."
            );

            return;
        }

        if (
            !Number.isInteger(soBanh) ||
            soBanh <= 0
        ) {
            hienLoiSanPham(
                "Số bánh phải là số nguyên lớn hơn 0."
            );

            return;
        }

        // Thêm mới bắt buộc phải chọn ảnh.
        // Sửa sản phẩm được phép giữ ảnh cũ.
        if (!idSua && !tepAnh) {
            hienLoiSanPham(
                "Vui lòng chọn ảnh sản phẩm."
            );

            return;
        }

        if (
            tepAnh &&
            !tepAnh.type.startsWith("image/")
        ) {
            hienLoiSanPham(
                "Tệp đã chọn không phải là ảnh."
            );

            return;
        }

        if (
            tepAnh &&
            tepAnh.size > 5 * 1024 * 1024
        ) {
            hienLoiSanPham(
                "Ảnh phải nhỏ hơn 5 MB."
            );

            return;
        }

        const nutLuu =
            formSanPham.querySelector(
                'button[type="submit"]'
            );

        nutLuu.disabled = true;

        nutLuu.textContent =
            idSua
                ? "Đang cập nhật..."
                : "Đang thêm...";

        thongBaoSanPham.textContent =
            idSua
                ? "Đang cập nhật sản phẩm..."
                : "Đang tải ảnh và thêm sản phẩm...";

        thongBaoSanPham.style.color =
            "#555555";

        const duLieuSanPham = {
            ten: ten,
            gia: gia,
            so_banh: soBanh,
            mo_ta: moTa,
            dang_ban: true
        };

        let duongDanAnhMoi = null;

        // Nếu chọn ảnh mới thì tải ảnh lên Supabase
        if (tepAnh) {
            const duoiAnh =
                layDuoiAnh(tepAnh);

            const maNgauNhien =
                typeof crypto.randomUUID ===
                "function"
                    ? crypto.randomUUID()
                    : Math.random()
                        .toString(36)
                        .slice(2);

            const tenAnhMoi =
                Date.now() +
                "-" +
                maNgauNhien +
                "." +
                duoiAnh;

            duongDanAnhMoi =
                "san-pham/" + tenAnhMoi;

            const { error: loiTaiAnh } =
                await supabaseClient.storage
                    .from("anh-san-pham")
                    .upload(
                        duongDanAnhMoi,
                        tepAnh,
                        {
                            contentType:
                                tepAnh.type,
                            upsert: false
                        }
                    );

            if (loiTaiAnh) {
                hienLoiSanPham(
                    "Không tải được ảnh: " +
                    loiTaiAnh.message
                );

                khoiPhucNutLuu(nutLuu);
                return;
            }

            const { data: duLieuAnh } =
                supabaseClient.storage
                    .from("anh-san-pham")
                    .getPublicUrl(
                        duongDanAnhMoi
                    );

            duLieuSanPham.anh_url =
                duLieuAnh.publicUrl;
        }

        let ketQua;

        if (idSua) {
            ketQua =
                await supabaseClient
                    .from("san_pham")
                    .update(duLieuSanPham)
                    .eq("id", idSua);
        } else {
            ketQua =
                await supabaseClient
                    .from("san_pham")
                    .insert(duLieuSanPham);
        }

        if (ketQua.error) {
            // Nếu không lưu được sản phẩm,
            // xóa ảnh mới vừa tải lên
            if (duongDanAnhMoi) {
                await supabaseClient.storage
                    .from("anh-san-pham")
                    .remove([
                        duongDanAnhMoi
                    ]);
            }

            hienLoiSanPham(
                "Không lưu được sản phẩm: " +
                ketQua.error.message
            );

            khoiPhucNutLuu(nutLuu);
            return;
        }

        thongBaoSanPham.textContent =
            idSua
                ? "Đã sửa sản phẩm thành công."
                : "Đã thêm sản phẩm thành công.";

        thongBaoSanPham.style.color =
            "#176b3a";

        formSanPham.reset();

        delete formSanPham.dataset.idSua;

        nutHuySua.classList.add("an");

        xoaAnhXemTruoc();

        khoiPhucNutLuu(nutLuu);

        await taiDanhSachSanPham();
    }
);


// ========================================
// 10. LẤY ĐUÔI ẢNH
// ========================================

function layDuoiAnh(tepAnh) {
    if (tepAnh.type === "image/png") {
        return "png";
    }

    if (tepAnh.type === "image/webp") {
        return "webp";
    }

    return "jpg";
}


// ========================================
// 11. KHÔI PHỤC NÚT LƯU
// ========================================

function khoiPhucNutLuu(nutLuu) {
    nutLuu.disabled = false;
    nutLuu.textContent =
        "💾 Lưu sản phẩm";
}


// ========================================
// 12. XÓA ẢNH XEM TRƯỚC
// ========================================

function xoaAnhXemTruoc() {
    if (duongDanAnhTam) {
        URL.revokeObjectURL(
            duongDanAnhTam
        );

        duongDanAnhTam = null;
    }

    anhXemTruoc.src = "";
    anhXemTruoc.classList.add("an");
}


// ========================================
// 13. HIỂN THỊ LỖI
// ========================================

function hienLoiSanPham(noiDung) {
    thongBaoSanPham.textContent =
        noiDung;

    thongBaoSanPham.style.color =
        "#c0392b";
}


// ========================================
// 14. LÀM SẠCH VĂN BẢN
// ========================================

function lamSachVanBan(noiDung) {
    const oTam =
        document.createElement("div");

    oTam.textContent =
        String(noiDung ?? "");

    return oTam.innerHTML;
}


// ========================================
// 15. TẢI DANH SÁCH SẢN PHẨM
// ========================================

async function taiDanhSachSanPham() {
    danhSachQuanLy.innerHTML =
        "<p>Đang tải danh sách sản phẩm...</p>";

    const { data, error } =
        await supabaseClient
            .from("san_pham")
            .select("*")
            .order(
                "ngay_tao",
                {
                    ascending: false
                }
            );

    if (error) {
        danhSachQuanLy.innerHTML =
            "<p>Không tải được sản phẩm: " +
            lamSachVanBan(error.message) +
            "</p>";

        return;
    }

    capNhatThongKe(data || []);

    if (!data || data.length === 0) {
        danhSachQuanLy.innerHTML =
            "<p>Chưa có dữ liệu sản phẩm.</p>";

        return;
    }

    danhSachQuanLy.innerHTML =
        data.map(function (sanPham) {
            const trangThai =
                sanPham.dang_ban
                    ? "Đang bán"
                    : "Đã ẩn";

            return `
                <article class="san-pham-admin">

                    <img
                        src="${lamSachVanBan(
                            sanPham.anh_url
                        )}"
                        alt="${lamSachVanBan(
                            sanPham.ten
                        )}"
                        loading="lazy"
                    >

                    <div class="noi-dung-san-pham-admin">

                        <h3>
                            ${lamSachVanBan(
                                sanPham.ten
                            )}
                        </h3>

                        <p>
                            ${lamSachVanBan(
                                sanPham.mo_ta
                            )}
                        </p>

                        <p>
                            <strong>
                                ${Number(
                                    sanPham.gia
                                ).toLocaleString(
                                    "vi-VN"
                                )}
                                đồng/
                                ${Number(
                                    sanPham.so_banh
                                )}
                                bánh
                            </strong>
                        </p>

                        <p class="trang-thai-san-pham">
                            ${trangThai}
                        </p>

                        <div class="cac-nut-san-pham">

                            <button
                                type="button"
                                class="nut nut-sua"
                                data-id="${sanPham.id}"
                            >
                                ✏️ Sửa sản phẩm
                            </button>

                            <button
                                type="button"
                                class="nut nut-an-hien"
                                data-id="${sanPham.id}"
                                data-dang-ban="${sanPham.dang_ban}"
                            >
                                ${
                                    sanPham.dang_ban
                                        ? "🙈 Ẩn sản phẩm"
                                        : "👁️ Hiện sản phẩm"
                                }
                            </button>

                        </div>

                    </div>

                </article>
            `;
        }).join("");

    ganSuKienNutSua();
    ganSuKienNutAnHien();

    locDanhSachSanPham();
}


// ========================================
// 16. CẬP NHẬT THỐNG KÊ
// ========================================

function capNhatThongKe(danhSach) {
    const tongSanPham =
        danhSach.length;

    const soSanPhamDangBan =
        danhSach.filter(
            function (sanPham) {
                return (
                    sanPham.dang_ban === true
                );
            }
        ).length;

    const soSanPhamDangAn =
        tongSanPham -
        soSanPhamDangBan;

    oTongSanPham.textContent =
        tongSanPham;

    oSanPhamDangBan.textContent =
        soSanPhamDangBan;

    oSanPhamDangAn.textContent =
        soSanPhamDangAn;
}


// ========================================
// 17. NÚT SỬA SẢN PHẨM
// ========================================

function ganSuKienNutSua() {
    const cacNutSua =
        document.querySelectorAll(
            ".nut-sua"
        );

    cacNutSua.forEach(function (nut) {
        nut.addEventListener(
            "click",
            function () {
                suaSanPham(
                    nut.dataset.id
                );
            }
        );
    });
}


// ========================================
// 18. LẤY SẢN PHẨM ĐỂ SỬA
// ========================================

async function suaSanPham(id) {
    thongBaoSanPham.textContent =
        "Đang lấy thông tin sản phẩm...";

    thongBaoSanPham.style.color =
        "#555555";

    const { data: sanPham, error } =
        await supabaseClient
            .from("san_pham")
            .select("*")
            .eq("id", id)
            .single();

    if (error) {
        hienLoiSanPham(
            "Không lấy được sản phẩm: " +
            error.message
        );

        return;
    }

    document
        .getElementById("ten-san-pham")
        .value =
            sanPham.ten ?? "";

    document
        .getElementById("gia-san-pham")
        .value =
            sanPham.gia ?? "";

    document
        .getElementById("so-banh")
        .value =
            sanPham.so_banh ?? "";

    document
        .getElementById("mo-ta-san-pham")
        .value =
            sanPham.mo_ta ?? "";

    formSanPham.dataset.idSua =
        sanPham.id;

    nutHuySua.classList.remove("an");

    if (sanPham.anh_url) {
        anhXemTruoc.src =
            sanPham.anh_url;

        anhXemTruoc.classList.remove(
            "an"
        );
    }

    oChonAnh.value = "";

    thongBaoSanPham.textContent =
        "Đang sửa sản phẩm. Không chọn ảnh mới nếu muốn giữ ảnh cũ.";

    thongBaoSanPham.style.color =
        "#176b3a";

    formSanPham.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


// ========================================
// 19. HỦY CHẾ ĐỘ SỬA
// ========================================

function huyCheDoSua() {
    formSanPham.reset();

    delete formSanPham.dataset.idSua;

    xoaAnhXemTruoc();

    thongBaoSanPham.textContent = "";

    nutHuySua.classList.add("an");
}

nutHuySua.addEventListener(
    "click",
    function () {
        huyCheDoSua();

        formSanPham.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
);


// ========================================
// 20. ẨN HOẶC HIỆN SẢN PHẨM
// ========================================

function ganSuKienNutAnHien() {
    const cacNutAnHien =
        document.querySelectorAll(
            ".nut-an-hien"
        );

    cacNutAnHien.forEach(function (nut) {
        nut.addEventListener(
            "click",
            async function () {
                const id =
                    nut.dataset.id;

                const dangBanHienTai =
                    nut.dataset.dangBan ===
                    "true";

                const trangThaiMoi =
                    !dangBanHienTai;

                nut.disabled = true;
                nut.textContent =
                    "Đang cập nhật...";

                const { error } =
                    await supabaseClient
                        .from("san_pham")
                        .update({
                            dang_ban:
                                trangThaiMoi
                        })
                        .eq("id", id);

                if (error) {
                    alert(
                        "Không cập nhật được: " +
                        error.message
                    );

                    nut.disabled = false;
                    return;
                }

                alert(
                    trangThaiMoi
                        ? "Đã hiện sản phẩm trên website."
                        : "Đã ẩn sản phẩm khỏi website."
                );

                await taiDanhSachSanPham();
            }
        );
    });
}


// ========================================
// 21. TÌM KIẾM VÀ LỌC SẢN PHẨM
// ========================================

function boDauTiengViet(noiDung) {
    return String(noiDung)
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D")
        .toLowerCase()
        .trim();
}

function locDanhSachSanPham() {
    const tuKhoa =
        boDauTiengViet(
            oTimSanPham.value
        );

    const trangThaiCanLoc =
        oLocTrangThai.value;

    const cacSanPham =
        document.querySelectorAll(
            ".san-pham-admin"
        );

    cacSanPham.forEach(
        function (sanPham) {
            const tenSanPham =
                sanPham.querySelector("h3")
                    ?.textContent || "";

            const tenDaXuLy =
                boDauTiengViet(
                    tenSanPham
                );

            const nutAnHien =
                sanPham.querySelector(
                    ".nut-an-hien"
                );

            const dangBan =
                nutAnHien?.dataset
                    .dangBan === "true";

            const dungTuKhoa =
                tenDaXuLy.includes(
                    tuKhoa
                );

            let dungTrangThai = true;

            if (
                trangThaiCanLoc ===
                "dang-ban"
            ) {
                dungTrangThai =
                    dangBan;
            }

            if (
                trangThaiCanLoc ===
                "dang-an"
            ) {
                dungTrangThai =
                    !dangBan;
            }

            sanPham.style.display =
                dungTuKhoa &&
                dungTrangThai
                    ? ""
                    : "none";
        }
    );
}

oTimSanPham.addEventListener(
    "input",
    locDanhSachSanPham
);

oLocTrangThai.addEventListener(
    "change",
    locDanhSachSanPham
);