// ========================================
// 1. KẾT NỐI SUPABASE
// ========================================

const SUPABASE_URL_SAN_PHAM =
    "https://nfdovcuvgdmdhynhuhxy.supabase.co";

const SUPABASE_KEY_SAN_PHAM =
    "sb_publishable_g4fa73qmE0k9nd9TUNTlpg_88X1DgfV";

const supabaseSanPham =
    window.supabase.createClient(
        SUPABASE_URL_SAN_PHAM,
        SUPABASE_KEY_SAN_PHAM
    );


// ========================================
// 2. LÀM SẠCH NỘI DUNG
// ========================================

function lamSachNoiDung(noiDung) {
    const oTam =
        document.createElement("div");

    oTam.textContent =
        String(noiDung ?? "");

    return oTam.innerHTML;
}


// ========================================
// 3. ĐỊNH DẠNG TIỀN
// ========================================

function dinhDangGiaSanPham(gia) {
    return Number(gia)
        .toLocaleString("vi-VN");
}


// ========================================
// 4. LẤY QUY CÁCH SẢN PHẨM
// ========================================

function layQuyCachSanPham(sanPham) {
    // Sản phẩm mới sử dụng cột quy_cach
    if (
        sanPham.quy_cach &&
        String(sanPham.quy_cach).trim()
    ) {
        return String(
            sanPham.quy_cach
        ).trim();
    }

    // Sản phẩm cũ sử dụng cột so_banh
    if (sanPham.so_banh) {
        return (
            sanPham.so_banh +
            " bánh"
        );
    }

    return "1 phần";
}


// ========================================
// 5. HIỂN THỊ THÔNG BÁO
// ========================================

function hienThongBaoSanPham(
    luoiSanPham,
    noiDung,
    mauChu
) {
    const thongBao =
        document.createElement("p");

    thongBao.className =
        "thong-bao-tai-san-pham";

    thongBao.textContent =
        noiDung;

    thongBao.style.color =
        mauChu;

    thongBao.style.gridColumn =
        "1 / -1";

    thongBao.style.textAlign =
        "center";

    luoiSanPham.appendChild(
        thongBao
    );
}


// ========================================
// 6. TẠO THẺ SẢN PHẨM
// ========================================

function taoTheSanPham(sanPham) {
    const theSanPham =
        document.createElement(
            "article"
        );

    theSanPham.className =
        "the-san-pham san-pham-tu-admin";

    const idSoLuong =
        "so-luong-admin-" +
        sanPham.id;

    const idThanhTien =
        "tien-admin-" +
        sanPham.id;

    const quyCach =
        layQuyCachSanPham(
            sanPham
        );

    const tenTrongGio =
        sanPham.ten +
        " - " +
        quyCach;

    const gia =
        Number(sanPham.gia);

    theSanPham.innerHTML = `
        <img
            class="anh-san-pham"
            src="${lamSachNoiDung(
                sanPham.anh_url
            )}"
            alt="${lamSachNoiDung(
                sanPham.ten
            )}"
            loading="lazy"
        >

        <div class="noi-dung-san-pham">

            <h3>
                ${lamSachNoiDung(
                    sanPham.ten
                )}
            </h3>

            <p>
                ${lamSachNoiDung(
                    sanPham.mo_ta
                )}
            </p>

            <p class="gia-san-pham">
                ${dinhDangGiaSanPham(
                    gia
                )}
                đồng/
                ${lamSachNoiDung(
                    quyCach
                )}
            </p>

            <div class="khung-gia">

                <div class="hang-so-luong">

                    <label for="${idSoLuong}">
                        Số phần:
                    </label>

                    <input
                        class="o-so-luong"
                        id="${idSoLuong}"
                        type="number"
                        min="1"
                        value="1"
                        inputmode="numeric"
                        data-gia="${gia}"
                        data-ketqua="${idThanhTien}"
                    >

                </div>

                <p class="thanh-tien">
                    Thành tiền:

                    <span id="${idThanhTien}">
                        ${dinhDangGiaSanPham(
                            gia
                        )}
                        đồng
                    </span>
                </p>

                <button
                    type="button"
                    class="nut nut-them-gio"
                    data-ten="${lamSachNoiDung(
                        tenTrongGio
                    )}"
                    data-gia="${gia}"
                    data-input="${idSoLuong}"
                >
                    🛒 Thêm vào giỏ
                </button>

            </div>

        </div>
    `;

    return theSanPham;
}


// ========================================
// 7. TẢI SẢN PHẨM TỪ SUPABASE
// ========================================

async function taiSanPhamTuSupabase() {
    const luoiSanPham =
        document.querySelector(
            ".luoi-san-pham"
        );

    if (!luoiSanPham) {
        return;
    }

    // Xóa thông báo lỗi cũ nếu có
    luoiSanPham
        .querySelectorAll(
            ".thong-bao-tai-san-pham"
        )
        .forEach(function (thongBao) {
            thongBao.remove();
        });

    // Xóa sản phẩm Supabase cũ để tránh bị lặp
    luoiSanPham
        .querySelectorAll(
            ".san-pham-tu-admin"
        )
        .forEach(function (sanPham) {
            sanPham.remove();
        });

    hienThongBaoSanPham(
        luoiSanPham,
        "Đang tải sản phẩm...",
        "#555555"
    );

    const { data, error } =
        await supabaseSanPham
            .from("san_pham")
            .select("*")
            .eq("dang_ban", true)
            .order(
                "ngay_tao",
                {
                    ascending: false
                }
            );

    // Xóa chữ đang tải
    luoiSanPham
        .querySelectorAll(
            ".thong-bao-tai-san-pham"
        )
        .forEach(function (thongBao) {
            thongBao.remove();
        });

    if (error) {
        hienThongBaoSanPham(
            luoiSanPham,
            "Không tải được sản phẩm: " +
                error.message,
            "#c0392b"
        );

        return;
    }

    if (!data || data.length === 0) {
        hienThongBaoSanPham(
            luoiSanPham,
            "Hiện chưa có sản phẩm mới.",
            "#666666"
        );

        document.dispatchEvent(
            new CustomEvent(
                "sanPhamDaTai"
            )
        );

        return;
    }

    data.forEach(function (sanPham) {
        const theSanPham =
            taoTheSanPham(
                sanPham
            );

        luoiSanPham.appendChild(
            theSanPham
        );
    });

    // Báo cho script.js kết nối:
    // tính tiền, tăng giảm, thêm giỏ và phóng ảnh
    document.dispatchEvent(
        new CustomEvent(
            "sanPhamDaTai"
        )
    );
}


// ========================================
// 8. BẮT ĐẦU TẢI SẢN PHẨM
// ========================================

taiSanPhamTuSupabase();