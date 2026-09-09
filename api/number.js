// ==========================================
// NUMBER INFO API — BY @Qfrexx (Sumi Hacker)
// ==========================================

module.exports = async (req, res) => {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ 
            status: 'error', 
            message: 'Use GET method only.'
        });
    }

    const { key, num, number, Astha } = req.query;
    const mobileNumber = num || number || Astha;

    // 🔥 APNI SECRET KEY (change karo)
    const VALID_KEY = 'UNIQVERCEL';

    // 1️⃣ API Key Check
    if (!key || key !== VALID_KEY) {
        return res.status(401).json({
            status: 'error',
            message: 'Invalid or missing API key.',
            credit: '@Qfrexx'
        });
    }

    // 2️⃣ Number Check
    if (!mobileNumber) {
        return res.status(400).json({
            status: 'error',
            message: 'Missing number parameter.',
            credit: '@Qfrexx'
        });
    }

    // 3️⃣ Clean Number
    const cleanNum = mobileNumber.replace(/[^0-9]/g, '');
    if (cleanNum.length < 10) {
        return res.status(400).json({
            status: 'error',
            message: 'Invalid number. Minimum 10 digits.',
            credit: '@Qfrexx'
        });
    }

    // 4️⃣ Fetch Data (Static + External)
    try {
        const data = await fetchNumberData(cleanNum);
        
        if (data) {
            return res.status(200).json({
                status: 'success',
                total_results: 1,
                result: [data],
                credit: '@Qfrexx',
                developer: '@Qfrexx (Sumi Hacker)'
            });
        } else {
            return res.status(404).json({
                status: 'error',
                message: 'No data found from any source.',
                number: cleanNum,
                credit: '@Qfrexx'
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error',
            credit: '@Qfrexx'
        });
    }
};

// ==========================================
// 🔥 DATA SOURCE — STATIC + EXTERNAL API
// ==========================================
async function fetchNumberData(number) {
    const axios = require('axios');
    
    // 📌 1️⃣ PEHLE APNE STATIC DATA ME CHECK KARO
    const staticData = {
        '9661990774': {
            mobile: '9661990774',
            name: 'Chandan Kumar Singh',
            fname: 'Paras Singh',
            address: '!12!bhatpar rani!near kali mander!bhingari bazar khampar!Deoria!Deoria!Uttar Pradesh!274702',
            alt: '9523242105',
            circle: 'BIHAR JIO',
            aadhar: '293649586679',
            email: 'N/A'
        }
        // 🔥 Yahan aur numbers daal sakte ho (optional)
    };
    if (staticData[number]) return staticData[number];

    // 📌 2️⃣ AGAR STATIC ME NAHI MILA TO EXTERNAL API SE LAO
    const externalApis = [
        {
            url: 'https://shuruu-num-to-info-welcome-api-7-da.vercel.app/apis/num_info_v1',
            params: { key: 'WELCOME', num: number },
            parse: (res) => {
                if (res.status === 'success' && res.result && res.result.length > 0) {
                    const d = res.result[0];
                    return {
                        mobile: d.mobile || number,
                        name: d.name || 'N/A',
                        fname: d.fname || 'N/A',
                        address: d.address || 'N/A',
                        alt: d.alt || 'N/A',
                        circle: d.circle || 'N/A',
                        aadhar: d.aadhar || 'N/A',
                        email: d.email || 'N/A'
                    };
                }
                return null;
            }
        },
        {
            url: 'https://num-to-info-reseller.asurpapa.workers.dev/api',
            params: { key: 'Free-Russian', number: number },
            parse: (res) => {
                if (res.status === true && res.data && res.data.data) {
                    const d = res.data.data;
                    return {
                        mobile: d.mobile || number,
                        name: d.name || 'N/A',
                        fname: d.fname || 'N/A',
                        address: d.address || 'N/A',
                        alt: d.alt || 'N/A',
                        circle: d.circle || 'N/A',
                        aadhar: d.aadhar || 'N/A',
                        email: d.email || 'N/A'
                    };
                }
                return null;
            }
        },
        {
            url: 'https://astha-9vd8.onrender.com/tapi-c3177593b1359e00d0e6c1a2d2cc6408',
            params: { Astha: number },
            parse: (res) => {
                if (res.status !== 'error' && res.data) {
                    const d = res.data;
                    return {
                        mobile: d.mobile || number,
                        name: d.name || 'N/A',
                        fname: d.fname || 'N/A',
                        address: d.address || 'N/A',
                        alt: d.alt || 'N/A',
                        circle: d.circle || 'N/A',
                        aadhar: d.aadhar || 'N/A',
                        email: d.email || 'N/A'
                    };
                }
                return null;
            }
        }
    ];

    // 🔥 SAB EXTERNAL APIS KO TRY KARO
    for (const api of externalApis) {
        try {
            const response = await axios.get(api.url, { params: api.params, timeout: 8000 });
            if (response.data) {
                const parsed = api.parse(response.data);
                if (parsed) return parsed;
            }
        } catch (e) {
            console.log(`⚠️ External API failed: ${api.url}`);
        }
    }

    // 📌 3️⃣ KUCH NAHI MILA TO NULL
    return null;
}
