// ========================================
// 1. KẾT NỐI SUPABASE
// ========================================

const SUPABASE_URL =
    "https://nfdovcuvgdmdhynhuhxy.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_g4fa73qmE0k9nd9TUNTlpg_88X1DgfV";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);


// ========================================
// 2. LẤY CÁC PHẦN TỬ TRÊN TRANG
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

        const email =
            document
                .getElementById("email-admin")
                .value
                .trim();

        const matKhau =
            document
                .getElementById("mat-khau-admin")
                .value;

        thongBaoDangNhap.textContent =
            "Đang đăng nhập...";

        thongBaoDangNhap.style.color =
            "#555555";

        const { error } =
            await supabaseClient.auth.signInWithPassword({
                email: email,
                password: matKhau
            });

        if (error) {
            thongBaoDangNhap.textContent =
                "Lỗi: " + error.message;

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
// 5. ĐĂNG XUẤT
// ========================================

nutDangXuat.addEventListener(
    "click",
    async function () {
        await supabaseClient.auth.signOut();

        hienTrangDangNhap();
    }
);


// ========================================
// 6. KIỂM TRA PHIÊN ĐĂNG NHẬP
// ========================================

async function kiemTraDangNhap() {
    const { data } =
        await supabaseClient.auth.getSession();

    if (data.session) {
        hienTrangQuanLy();
    } else {
        hienTrangDangNhap();
    }
}

kiemTraDangNhap();


// ========================================
// 7. XEM TRƯỚC ẢNH
// ========================================

oChonAnh.addEventListener(
    "change",
    function () {
        const tepAnh = oChonAnh.files[0];

        if (!tepAnh) {
            anhXemTruoc.src = "";
            anhXemTruoc.classList.add("an");

            return;
        }

        const duongDanTam =
            URL.createObjectURL(tepAnh);

        anhXemTruoc.src = duongDanTam;
        anhXemTruoc.classList.remove("an");
    }
);


// ========================================
// 8. THÊM SẢN PHẨM
// ========================================

formSanPham.addEventListener(
    "submit",
    async function (suKien) {
        suKien.preventDefault();

        const ten =
            document
                .getElementById("ten-san-pham")
                .value
                .trim();

        const gia =
            parseInt(
                document
                    .getElementById("gia-san-pham")
                    .value
            );

        const soBanh =
            parseInt(
                document
                    .getElementById("so-banh")
                    .value
            );

        const moTa =
            document
                .getElementById("mo-ta-san-pham")
                .value
                .trim();

        const tepAnh =
            document
                .getElementById("anh-san-pham")
                .files[0];

        if (!tepAnh) {
            hienLoiSanPham(
                "Vui lòng chọn ảnh sản phẩm."
            );

            return;
        }

        if (!tepAnh.type.startsWith("image/")) {
            hienLoiSanPham(
                "Tệp đã chọn không phải là ảnh."
            );

            return;
        }

        if (tepAnh.size > 5 * 1024 * 1024) {
            hienLoiSanPham(
                "Ảnh phải nhỏ hơn 5 MB."
            );

            return;
        }

        thongBaoSanPham.textContent =
            "Đang tải ảnh và lưu sản phẩm...";

        thongBaoSanPham.style.color =
            "#555555";

        const duoiAnh =
            tepAnh.name
                .split(".")
                .pop()
                .toLowerCase();

        const tenAnhMoi =
            Date.now() +
            "-" +
            crypto.randomUUID() +
            "." +
            duoiAnh;

        const duongDanAnh =
            "san-pham/" + tenAnhMoi;

        const { error: loiTaiAnh } =
            await supabaseClient.storage
                .from("anh-san-pham")
                .upload(
                    duongDanAnh,
                    tepAnh,
                    {
                        contentType: tepAnh.type,
                        upsert: false
                    }
                );

        if (loiTaiAnh) {
            hienLoiSanPham(
                "Không tải được ảnh: " +
                loiTaiAnh.message
            );

            return;
        }

        const { data: duLieuAnh } =
            supabaseClient.storage
                .from("anh-san-pham")
                .getPublicUrl(duongDanAnh);

        const { error: loiSanPham } =
            await supabaseClient
                .from("san_pham")
                .insert({
                    ten: ten,
                    gia: gia,
                    so_banh: soBanh,
                    mo_ta: moTa,
                    anh_url:
                        duLieuAnh.publicUrl,
                    dang_ban: true
                });

        if (loiSanPham) {
            await supabaseClient.storage
                .from("anh-san-pham")
                .remove([duongDanAnh]);

            hienLoiSanPham(
                "Không lưu được sản phẩm: " +
                loiSanPham.message
            );

            return;
        }

        thongBaoSanPham.textContent =
            "Đã thêm sản phẩm thành công.";

        thongBaoSanPham.style.color =
            "#176b3a";

        formSanPham.reset();

        anhXemTruoc.src = "";
        anhXemTruoc.classList.add("an");

        await taiDanhSachSanPham();
    }
);


// ========================================
// 9. HIỂN THỊ LỖI SẢN PHẨM
// ========================================

function hienLoiSanPham(noiDung) {
    thongBaoSanPham.textContent = noiDung;
    thongBaoSanPham.style.color = "#c0392b";
}


// ========================================
// 10. LÀM SẠCH VĂN BẢN
// ========================================

function lamSachVanBan(noiDung) {
    const oTam =
        document.createElement("div");

    oTam.textContent =
        String(noiDung ?? "");

    return oTam.innerHTML;
}


// ========================================
// 11. TẢI DANH SÁCH SẢN PHẨM
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

    if (!data || data.length === 0) {
        danhSachQuanLy.innerHTML =
            "<p>Chưa có dữ liệu sản phẩm.</p>";

        return;
    }

    danhSachQuanLy.innerHTML =
        data.map(function (sanPham) {
            return `
                <article class="san-pham-admin">

                    <img
                        src="${lamSachVanBan(
                            sanPham.anh_url
                        )}"
                        alt="${lamSachVanBan(
                            sanPham.ten
                        )}"
                    >

                    <div>

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

                    </div>

                </article>
            `;
        }).join("");
}