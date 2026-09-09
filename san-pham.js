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
// 3. TẢI SẢN PHẨM
// ========================================

async function taiSanPhamTuSupabase() {
    const luoiSanPham =
        document.querySelector(
            ".luoi-san-pham"
        );

    if (!luoiSanPham) {
        return;
    }

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

    if (error) {
        const thongBao =
            document.createElement("p");

        thongBao.textContent =
            "Không tải được sản phẩm: " +
            error.message;

        thongBao.style.color =
            "#c0392b";

        luoiSanPham.appendChild(
            thongBao
        );

        return;
    }

    if (!data || data.length === 0) {
        document.dispatchEvent(
            new CustomEvent(
                "sanPhamDaTai"
            )
        );

        return;
    }

    data.forEach(function (sanPham) {
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

        const tenTrongGio =
            sanPham.ten +
            " - " +
            sanPham.so_banh +
            " bánh";

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
                            data-gia="${Number(
                                sanPham.gia
                            )}"
                            data-ketqua="${idThanhTien}"
                        >

                    </div>

                    <p class="thanh-tien">
                        Thành tiền:

                        <span id="${idThanhTien}">
                            ${Number(
                                sanPham.gia
                            ).toLocaleString(
                                "vi-VN"
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
                        data-gia="${Number(
                            sanPham.gia
                        )}"
                        data-input="${idSoLuong}"
                    >
                        🛒 Thêm vào giỏ
                    </button>

                </div>

            </div>
        `;

        luoiSanPham.appendChild(
            theSanPham
        );
    });

    // Báo cho script.js kết nối các nút mới
    document.dispatchEvent(
        new CustomEvent(
            "sanPhamDaTai"
        )
    );
}


// ========================================
// 4. BẮT ĐẦU TẢI
// ========================================

taiSanPhamTuSupabase();