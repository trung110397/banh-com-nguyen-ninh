const SUPABASE_URL_SAN_PHAM =
    "https://nfdovcuvgdmdhynhuhxy.supabase.co";

const SUPABASE_KEY_SAN_PHAM =
    "sb_publishable_g4fa73qmE0k9nd9TUNTlpg_88X1DgfV";

const supabaseSanPham = window.supabase.createClient(
    SUPABASE_URL_SAN_PHAM,
    SUPABASE_KEY_SAN_PHAM
);

function lamSachNoiDung(noiDung) {
    const oTam = document.createElement("div");
    oTam.textContent = noiDung;
    return oTam.innerHTML;
}

async function taiSanPhamTuSupabase() {
    const luoiSanPham =
        document.querySelector(".luoi-san-pham");

    const { data, error } =
        await supabaseSanPham
            .from("san_pham")
            .select("*")
            .eq("dang_ban", true)
            .order("ngay_tao", {
                ascending: false
            });

    if (error) {
        const thongBao = document.createElement("p");

        thongBao.textContent =
            "Không tải được sản phẩm: " + error.message;

        thongBao.style.color = "#c0392b";
        luoiSanPham.appendChild(thongBao);
        return;
    }

    data.forEach(function (sanPham) {
        const theSanPham =
            document.createElement("article");

        theSanPham.className = "the-san-pham";

        theSanPham.innerHTML = `
            <img
                src="${sanPham.anh_url}"
                alt="${lamSachNoiDung(sanPham.ten)}"
            >

            <div class="noi-dung-the">

                <h2>
                    ${lamSachNoiDung(sanPham.ten)}
                </h2>

                <p>
                    ${lamSachNoiDung(sanPham.mo_ta)}
                </p>

                <p class="gia-the">
                    ${Number(sanPham.gia).toLocaleString("vi-VN")}
                    đồng/${sanPham.so_banh} bánh
                </p>

                <a
                    href="https://www.facebook.com/profile.php?id=61591610027403"
                    target="_blank"
                    class="nut-xem-chi-tiet"
                >
                    Đặt hàng
                </a>

            </div>
        `;

        luoiSanPham.appendChild(theSanPham);
    });
}

taiSanPhamTuSupabase();