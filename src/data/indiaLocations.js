/**
 * Andhra Pradesh & Telangana Official Districts Database
 * Covers all 26 districts of Andhra Pradesh and all 33 districts of Telangana.
 */

export const stateDistrictMap = {
  "Andhra Pradesh": [
    "Alluri Sitharama Raju",
    "Anakapalli",
    "Ananthapuramu (Anantapur)",
    "Annamayya",
    "Bapatla",
    "Chittoor",
    "Dr. B.R. Ambedkar Konaseema",
    "East Godavari (Rajahmundry)",
    "Eluru",
    "Guntur",
    "Kakinada",
    "Krishna (Machilipatnam)",
    "Kurnool",
    "Nandyal",
    "NTR (Vijayawada)",
    "Palnadu (Narasaraopet)",
    "Parvathipuram Manyam",
    "Prakasam (Ongole)",
    "Sri Potti Sriramulu Nellore",
    "Sri Sathya Sai (Puttaparthi)",
    "Srikakulam",
    "Tirupati",
    "Visakhapatnam",
    "Vizianagaram",
    "West Godavari (Bhimavaram)",
    "YSR (Kadapa)"
  ],
  "Telangana": [
    "Adilabad",
    "Bhadradri Kothagudem",
    "Hanumakonda",
    "Hyderabad",
    "Jagtial",
    "Jangaon",
    "Jayashankar Bhupalpally",
    "Jogulamba Gadwal",
    "Kamareddy",
    "Karimnagar",
    "Khammam",
    "Kumuram Bheem Asifabad",
    "Mahabubabad",
    "Mahabubnagar",
    "Mancherial",
    "Medak",
    "Medchal-Malkajgiri",
    "Mulugu",
    "Nagarkurnool",
    "Nalgonda",
    "Narayanpet",
    "Nirmal",
    "Nizamabad",
    "Peddapalli",
    "Rajanna Sircilla",
    "Ranga Reddy",
    "Sangareddy",
    "Siddipet",
    "Suryapet",
    "Vikarabad",
    "Wanaparthy",
    "Warangal",
    "Yadadri Bhuvanagiri"
  ]
};

export const indianStates = Object.keys(stateDistrictMap);

/**
 * Returns a flat array of formatted "District, State" strings for AP and Telangana.
 */
export const allIndiaDistrictOptions = Object.entries(stateDistrictMap).flatMap(
  ([state, districts]) => districts.map((district) => `${district}, ${state}`)
);
