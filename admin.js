// ========================================
// 1. KẾT NỐI SUPABASE
// ========================================

const SUPABASE_URL =
    "https://nfdovcuvgdmdhynhuhxy.supabase.co";

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

const nutLuuSanPham =
    document.getElementById("nut-luu-san-pham");

const nutHuySua =
    document.getElementById("nut-huy-sua");

const thongBaoSanPham =
    document.getElementById("thong-bao-san-pham");

const oChonAnh =
    document.getElementById("anh-san-pham");

const anhXemTruoc =
    document.getElementById("anh-xem-truoc");

const danhSachQuanLy =
    document.getElementById("danh-sach-quan-ly");

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
// 4. ĐĂNG NHẬP
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

        formDangNhap.reset();
        thongBaoDangNhap.textContent = "";

        hienTrangQuanLy();
    }
);


// ========================================
// 5. DỊCH LỖI ĐĂNG NHẬP
// ========================================

function dichLoiDangNhap(loi) {
    const noiDung =
        String(loi).toLowerCase();

    if (
        noiDung.includes(
            "invalid login credentials"
        )
    ) {
        return "Email hoặc mật khẩu không đúng.";
    }

    if (
        noiDung.includes(
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
// 7. KIỂM TRA ĐĂNG NHẬP
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
            xoaAnhXemTruoc();
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
            formSanPham.dataset.idSua || "";

        const ten = document
            .getElementById("ten-san-pham")
            .value
            .trim();

        const gia = Number(
            document
                .getElementById("gia-san-pham")
                .value
        );

        const quyCach = document
            .getElementById("quy-cach")
            .value
            .trim();

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

        if (!quyCach) {
            hienLoiSanPham(
                "Vui lòng nhập số lượng hoặc quy cách."
            );
            return;
        }

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

        batDauLuuSanPham(
            idSua
                ? "Đang cập nhật sản phẩm..."
                : "Đang thêm sản phẩm..."
        );
        const duLieuSanPham = {
     ten: ten,
     gia: gia,
     quy_cach: quyCach,
     mo_ta: moTa,
     so_banh: 1
     };


        let duongDanAnhMoi = null;

        // Tải ảnh mới nếu đã chọn ảnh
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

            duongDanAnhMoi =
                "san-pham/" +
                Date.now() +
                "-" +
                maNgauNhien +
                "." +
                duoiAnh;

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

                ketThucLuuSanPham();
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

        let loiLuu = null;
        let daSuaDuLieu = true;

        if (idSua) {
            const {
                data: duLieuCapNhat,
                error
            } = await supabaseClient
                .from("san_pham")
                .update(duLieuSanPham)
                .eq("id", idSua)
                .select("id");

            loiLuu = error;

            daSuaDuLieu =
                Array.isArray(duLieuCapNhat) &&
                duLieuCapNhat.length > 0;
        } else {
            const { error } =
                await supabaseClient
                    .from("san_pham")
                    .insert({
                        ...duLieuSanPham,
                        dang_ban: true
                    });

            loiLuu = error;
        }

        if (
            loiLuu ||
            (idSua && !daSuaDuLieu)
        ) {
            if (duongDanAnhMoi) {
                await supabaseClient.storage
                    .from("anh-san-pham")
                    .remove([
                        duongDanAnhMoi
                    ]);
            }

            if (
                idSua &&
                !loiLuu &&
                !daSuaDuLieu
            ) {
                hienLoiSanPham(
                    "Không sửa được sản phẩm. Hãy kiểm tra quyền UPDATE trong Supabase."
                );
            } else {
                hienLoiSanPham(
                    "Không lưu được sản phẩm: " +
                    loiLuu.message
                );
            }

            ketThucLuuSanPham();
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
        ketThucLuuSanPham();

        await taiDanhSachSanPham();
    }
);


// ========================================
// 10. TRẠNG THÁI NÚT LƯU
// ========================================

function batDauLuuSanPham(noiDung) {
    nutLuuSanPham.disabled = true;
    nutLuuSanPham.textContent =
        "Đang xử lý...";

    thongBaoSanPham.textContent =
        noiDung;

    thongBaoSanPham.style.color =
        "#555555";
}

function ketThucLuuSanPham() {
    nutLuuSanPham.disabled = false;
    nutLuuSanPham.textContent =
        "💾 Lưu sản phẩm";
}


// ========================================
// 11. XỬ LÝ ẢNH
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
// 12. HIỂN THỊ LỖI
// ========================================

function hienLoiSanPham(noiDung) {
    thongBaoSanPham.textContent =
        noiDung;

    thongBaoSanPham.style.color =
        "#c0392b";
}

function lamSachVanBan(noiDung) {
    const oTam =
        document.createElement("div");

    oTam.textContent =
        String(noiDung ?? "");

    return oTam.innerHTML;
}


// ========================================
// 13. TẢI DANH SÁCH
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
            const quyCach =
                sanPham.quy_cach ||
                (
                    sanPham.so_banh
                        ? sanPham.so_banh +
                          " bánh"
                        : "Chưa có quy cách"
                );

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
                                ${lamSachVanBan(
                                    quyCach
                                )}
                            </strong>
                        </p>

                        <p class="trang-thai-san-pham">
                            ${
                                sanPham.dang_ban
                                    ? "Đang bán"
                                    : "Đã ẩn"
                            }
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
// 14. THỐNG KÊ
// ========================================

function capNhatThongKe(danhSach) {
    const tong =
        danhSach.length;

    const dangBan =
        danhSach.filter(
            function (sanPham) {
                return (
                    sanPham.dang_ban === true
                );
            }
        ).length;

    oTongSanPham.textContent = tong;
    oSanPhamDangBan.textContent = dangBan;
    oSanPhamDangAn.textContent =
        tong - dangBan;
}


// ========================================
// 15. SỬA SẢN PHẨM
// ========================================

function ganSuKienNutSua() {
    document
        .querySelectorAll(".nut-sua")
        .forEach(function (nut) {
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

async function suaSanPham(id) {
    thongBaoSanPham.textContent =
        "Đang lấy thông tin sản phẩm...";

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

    const quyCach =
        sanPham.quy_cach ||
        (
            sanPham.so_banh
                ? sanPham.so_banh + " bánh"
                : ""
        );

    document
        .getElementById("ten-san-pham")
        .value =
            sanPham.ten ?? "";

    document
        .getElementById("gia-san-pham")
        .value =
            sanPham.gia ?? "";

    document
        .getElementById("quy-cach")
        .value =
            quyCach;

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

        anhXemTruoc.classList.remove("an");
    }

    oChonAnh.value = "";

    thongBaoSanPham.textContent =
        "Đang sửa sản phẩm. Để trống ảnh nếu muốn giữ ảnh cũ.";

    thongBaoSanPham.style.color =
        "#176b3a";

    formSanPham.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


// ========================================
// 16. HỦY SỬA
// ========================================

function huyCheDoSua() {
    formSanPham.reset();

    delete formSanPham.dataset.idSua;

    xoaAnhXemTruoc();

    thongBaoSanPham.textContent = "";

    nutHuySua.classList.add("an");

    ketThucLuuSanPham();
}

nutHuySua.addEventListener(
    "click",
    function () {
        huyCheDoSua();
    }
);


// ========================================
// 17. ẨN/HIỆN SẢN PHẨM
// ========================================

function ganSuKienNutAnHien() {
    document
        .querySelectorAll(
            ".nut-an-hien"
        )
        .forEach(function (nut) {
            nut.addEventListener(
                "click",
                async function () {
                    const id =
                        nut.dataset.id;

                    const dangBan =
                        nut.dataset
                            .dangBan ===
                        "true";

                    nut.disabled = true;
                    nut.textContent =
                        "Đang cập nhật...";

                    const {
                        data,
                        error
                    } = await supabaseClient
                        .from("san_pham")
                        .update({
                            dang_ban:
                                !dangBan
                        })
                        .eq("id", id)
                        .select("id");

                    if (
                        error ||
                        !data ||
                        data.length === 0
                    ) {
                        alert(
                            error
                                ? error.message
                                : "Không có quyền cập nhật sản phẩm."
                        );

                        nut.disabled = false;
                        return;
                    }

                    await taiDanhSachSanPham();
                }
            );
        });
}


// ========================================
// 18. TÌM KIẾM VÀ LỌC
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

    const trangThai =
        oLocTrangThai.value;

    document
        .querySelectorAll(
            ".san-pham-admin"
        )
        .forEach(function (sanPham) {
            const ten =
                sanPham.querySelector("h3")
                    ?.textContent || "";

            const nutAnHien =
                sanPham.querySelector(
                    ".nut-an-hien"
                );

            const dangBan =
                nutAnHien?.dataset
                    .dangBan === "true";

            const dungTen =
                boDauTiengViet(ten)
                    .includes(tuKhoa);

            let dungTrangThai = true;

            if (trangThai === "dang-ban") {
                dungTrangThai = dangBan;
            }

            if (trangThai === "dang-an") {
                dungTrangThai = !dangBan;
            }

            sanPham.style.display =
                dungTen && dungTrangThai
                    ? ""
                    : "none";
        });
}

oTimSanPham.addEventListener(
    "input",
    locDanhSachSanPham
);

oLocTrangThai.addEventListener(
    "change",
    locDanhSachSanPham
);