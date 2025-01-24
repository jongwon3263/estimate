// 최종 금액
let totalPriceComponents = {
    cleaning: 0,
    floorCoating: 0,
    syndrome: 0,
    smallCleaning: 0,
    paint: 0,
    julun_floor: 0,
    julun_wall: 0,
    julun_silicone: 0,
    coating_kitchen: 0,
    coating_nano: 0,
    coating_wallTile: 0,
    coating_floorTile: 0,
    discount: 0, // 할인 금액
};

//--가격--//
//소형평수
const smallCleaningPrices = {
    _1room: 230000,
    separated1room: 250000,
    doubleDecker1room: 270000,
    _2room1bath: 290000,
    _3room1bath: 320000,
    _3room2bath: 350000
};

const smallSyndromePrices = {
    _1room: 310000,
    separated1room: 310000,
    doubleDecker1room: 340000,
    _2room1bath: 340000,
    _3room1bath: 370000,
    _3room2bath: 400000
};

//탄성코트
const paintPrices = {
    basic: 490000,
    standard: 690000,
    premium: 890000
};

//줄눈
const julunPrices = {
    //바닥
    julun1_1: 240000,
    julun1_2: 340000,
    julun1_3: 110000,
    julun1_4: 22000, // 평당 가격
    julun1_5: 40000,  // 평당 가격
    //벽면
    julun2_1: 490000,
    julun2_2: 890000,
    julun2_3: 220000,
    julun2_4: 220000,
    julun2_5: 220000,
    //실오방
    julun3_1: 80000,
    julun3_2: 150000,
    julun3_3: 80000,
    
};

//생활코팅
const coatingPrices = {
    //상판
    coating1_1: 330000,
    coating1_2: 330000,
    //나노
    coating2_1: 220000,
    coating2_2: 220000,
    //바닥타일
    coating3_1: 190000,
    coating3_2: 190000,
    //벽면타일
    coating4_1: 220000,
    coating4_2: 220000,
    coating4_3: 330000,
    coating4_4: 330000
};

let cleaningPrice = 0;
let floorCoatingPrice = 0;
let syndromePrice = 0;


const UIElements = {
    //--일반 or 소형평수 선택--//
    selectRoomType: document.getElementById('selectRoomType'),
    normalTypeDiv: document.getElementById('normalType'),
    smallTypeDiv: document.getElementById('smallType'),
    
    // 금액 표시 요소 가져오기
    smallCleaningPriceResult: document.getElementById('smallCleaningPriceResult'),
    floorCoatingResultContainer: document.getElementById('floorCoatingResult'),
    syndromeResultContainer: document.getElementById('syndromeResult'),
    cleaningPriceResult: document.getElementById('cleaningPriceResult'),
    
    // 소형평수 라디오체크 여부
    selectedStructure: () => document.querySelector('input[name="structure"]:checked'),
    roomSize: () => parseInt(document.getElementById('size').value) || 0,
    discount_1: () => parseInt(document.getElementById('discount_1').value) || 0,
    selectedRoomType: () => UIElements.selectRoomType.value,
}



function updateRoomTypeVisibility () {

    const selectedRoomType = UIElements.selectedRoomType();
    // 일반 평수 선택
    if (selectedRoomType === 'normalType') {
        UIElements.normalTypeDiv.style.display = 'block';
        UIElements.smallTypeDiv.style.display = 'none';
        document.querySelectorAll('input[name="structure"]').forEach(radio => {
            radio.checked = false;
        });

        // 소형 평수 금액 초기화
        totalPriceComponents.smallCleaning = 0;
        totalPriceComponents.floorCoating = 0;
        totalPriceComponents.syndrome = 0;

        UIElements.smallCleaningPriceResult.textContent = ''; // 소형 평수 금액 초기화

        updateTotalPrice(); // 총합계 업데이트
        
    // 소형 평수 선택    
    } else if (selectedRoomType === 'smallType') {
        UIElements.smallTypeDiv.style.display = 'block';
        UIElements.normalTypeDiv.style.display = 'none';
        document.getElementById('size').value = '';

        // 일반 평수 금액 초기화
        totalPriceComponents.cleaning = 0;
        totalPriceComponents.floorCoating = 0;
        totalPriceComponents.syndrome = 0;

        UIElements.cleaningPriceResult.textContent = ''; // 일반 평수 금액 초기화
        updateTotalPrice(); // 총합계 업데이트
    }
}

UIElements.selectRoomType.addEventListener('change', updateRoomTypeVisibility);
updateRoomTypeVisibility(); // 초기 호출


//---23평 이상 입주청소, 마루코팅, 새집증후군---// 
function updateUI() {
    const roomSize = UIElements.roomSize();
    const warningContainer = document.getElementById('warningContainer');
    const coatingOption = document.getElementById('coatingOption').value;
    const syndromeCheckbox = document.getElementById('newHouseSyndrome').checked;
    const selectedRoomType = UIElements.selectedRoomType();
    const selectedStructure = UIElements.selectedStructure();

    // 입주청소 금액 계산
    if (roomSize) {
        cleaningPrice = roomSize * 15000;
        UIElements.cleaningPriceResult.textContent = `입주청소 ${cleaningPrice.toLocaleString()}원`;

        // 경고 메시지 표시
        if (roomSize < 23 || roomSize >= 80) {
            warningContainer.textContent = "평수를 정확히 확인해 주세요!";
            warningContainer.style.display = "block";
        } else {
            warningContainer.style.display = "none";
        }
    } else {
        cleaningPrice = 0; // 청소 금액 초기화
        warningContainer.style.display = "none";
        UIElements.cleaningPriceResult.textContent = '';
    }

    // 마루코팅 금액 계산
    if (coatingOption === "room_excluded") {
        floorCoatingPrice = roomSize * 7000; // 방 미포함
    } else if (coatingOption === "room_included") {
        floorCoatingPrice = roomSize * 13000; // 방 포함
    } else {
        floorCoatingPrice = 0; // 기타 옵션 초기화
    }

    UIElements.floorCoatingResultContainer.textContent = floorCoatingPrice 
        ? `마루코팅 ${floorCoatingPrice.toLocaleString()}원` 
        : ''; // 결과 표시 또는 초기화

    // 새집증후군 금액 계산
    if (syndromeCheckbox && selectedRoomType === 'normalType' && roomSize > 1) {
        syndromePrice = roomSize * 18000;
    } else if (syndromeCheckbox && selectedRoomType === 'smallType' && selectedStructure) {
        syndromePrice = smallSyndromePrices[selectedStructure.value] || 0;
    } else {
        syndromePrice = 0;
    }
    
    UIElements.syndromeResultContainer.textContent = syndromePrice
    ? `새집증후군 시공 ${syndromePrice.toLocaleString()}원`
    : '';

    // 금액 업데이트
    totalPriceComponents.cleaning = cleaningPrice;
    totalPriceComponents.floorCoating = floorCoatingPrice;
    totalPriceComponents.syndrome = syndromePrice;

    updateTotalPrice();
}
const customerName = document.getElementById('customerName');

// 소형평수 구조 선택에 따른 금액 업데이트
function updateSmallCleaningPrice(event) {
    const selectedStructure = event.target;
    if (selectedStructure.name === 'structure' && selectedStructure.checked) {
        const selectedPrice = smallCleaningPrices[selectedStructure.value];
        UIElements.smallCleaningPriceResult.textContent = `입주청소 ${selectedPrice.toLocaleString()}원`;
        totalPriceComponents.smallCleaning = selectedPrice;
    } else {
        totalPriceComponents.smallCleaning = 0;
    }
    
    updateTotalPrice();
}


function handlePaintOption(event) {
    const paintPriceResult = document.getElementById('paintPriceResult');

    if (event && event.type === 'change') {
        // 라디오 버튼이 변경된 경우 (옵션 선택)
        const selectedPaint = event.target;

        if (selectedPaint.name === 'paintOption' && selectedPaint.checked) {
            const selectedPaintPrice = paintPrices[selectedPaint.value] || 0;
            paintPriceResult.textContent = `${selectedPaintPrice.toLocaleString()}원`;
            totalPriceComponents.paint = selectedPaintPrice;
        }
    } else if (event && event.type === 'click') {
        // 초기화 버튼이 클릭된 경우
        const radios = document.querySelectorAll('input[name="paintOption"]');
        radios.forEach(radio => (radio.checked = false));

        paintPriceResult.textContent = '0원';
        totalPriceComponents.paint = 0;
    }

    // 최종 금액 업데이트
    updateTotalPrice();
}

let selectedJulunOptions = []; // 선택된 줄눈 옵션을 저장할 배열

// 줄눈가격
function handleJulunOption() {
    let totalPrice = 0;
    const roomSize = parseInt(document.getElementById('size').value) || 0;

    let floorTotal = 0;
    let wallTotal = 0;
    let siliconeTotal = 0;

    selectedJulunOptions = []; // 기존 선택된 옵션 초기화

    // 바닥 라디오 버튼 (julun1_1, julun1_2)
    const selectedFloorOption = document.querySelector('input[name="julunFloor"]:checked');
    if (selectedFloorOption && julunPrices[selectedFloorOption.id]) {
        floorTotal += julunPrices[selectedFloorOption.id];
        selectedJulunOptions.push(
            document.querySelector(`label[for="${selectedFloorOption.id}"]`).textContent
        );
    }

    // 바닥 체크박스 (julun1_3)
    const julun1_3 = document.getElementById('julun1_3');
    if (julun1_3.checked && julunPrices[julun1_3.id]) {
        floorTotal += julunPrices[julun1_3.id];
        selectedJulunOptions.push(
            document.querySelector(`label[for="${julun1_3.id}"]`).textContent
        );
    }

    // 바닥 줄눈 평단가 계산 라디오 버튼 (julun1_4, julun1_5)
    const selectedFloorAreaOption = document.querySelector('input[name="julunFloorArea"]:checked');
    if (selectedFloorAreaOption && julunPrices[selectedFloorAreaOption.id]) {
        const areaPrice = roomSize * julunPrices[selectedFloorAreaOption.id];
        floorTotal += areaPrice;
        selectedJulunOptions.push(
            `${document.querySelector(`label[for="${selectedFloorAreaOption.id}"]`).textContent} (${roomSize}평 적용)`
        );
    }


    // 벽면 줄눈 라디오 버튼 (julun2_1, julun2_2)
    const selectedWallOption = document.querySelector('input[name="julunWall"]:checked');
    if (selectedWallOption && julunPrices[selectedWallOption.id]) {
        wallTotal += julunPrices[selectedWallOption.id];
        selectedJulunOptions.push(
            document.querySelector(`label[for="${selectedWallOption.id}"]`).textContent
        );
    }

    // 벽면 체크박스 (julun2_3, julun2_4, julun2_5)
    document.querySelectorAll('input[name="julunWallMore"]:checked').forEach(checkbox => {
        if (julunPrices[checkbox.id]) {
            wallTotal += julunPrices[checkbox.id];
            selectedJulunOptions.push(
                document.querySelector(`label[for="${checkbox.id}"]`).textContent
            );
        }
    });

    // 실리콘 라디오 버튼 (julun3_1, julun3_2)
    const selectedSiliconeOption = document.querySelector('input[name="bathroomJulunSilicone"]:checked');
    if (selectedSiliconeOption && julunPrices[selectedSiliconeOption.id]) {
        siliconeTotal += julunPrices[selectedSiliconeOption.id];
        selectedJulunOptions.push(
            document.querySelector(`label[for="${selectedSiliconeOption.id}"]`).textContent
        );
    }

    // 실리콘 체크박스 (julun3_3)
    const julun3_3 = document.getElementById('julun3_3');
    if (julun3_3.checked && julunPrices[julun3_3.id]) {
        siliconeTotal += julunPrices[julun3_3.id];
        selectedJulunOptions.push(
            document.querySelector(`label[for="${julun3_3.id}"]`).textContent
        );
    }

    // 각 항목의 합계를 totalPriceComponents에 저장
    totalPriceComponents.julun_floor = floorTotal;
    totalPriceComponents.julun_wall = wallTotal;
    totalPriceComponents.julun_silicone = siliconeTotal;

    // 총 합계를 julun_total에 계산하여 저장
    const julun_total = calculateJulunTotal();

    // UI 업데이트
    document.getElementById('julunPriceResult').textContent = `${julun_total.toLocaleString()}원`;

    // 총 금액 업데이트
    updateTotalPrice();
}

// julun 계산 함수
function calculateJulunTotal() {
    return (
        totalPriceComponents.julun_floor +
        totalPriceComponents.julun_wall +
        totalPriceComponents.julun_silicone
    );
}

// 바닥 줄눈 초기화
function initializeFloorJulunOption(event) {
    if (event && event.type === 'click') {
        // 바닥 줄눈 관련 라디오 버튼 초기화
        const radioJulunFloor = document.querySelectorAll('input[name="julunFloor"]');
        radioJulunFloor.forEach(radio => (radio.checked = false));

        // 바닥 줄눈 평단가 계산 라디오 버튼 초기화
        const radioJulunFloorArea = document.querySelectorAll('input[name="julunFloorArea"]');
        radioJulunFloorArea.forEach(radio => (radio.checked = false));

        // 바닥 줄눈 체크박스 초기화
        const isChecked = document.getElementById('julun1_3');
        if (isChecked) {
            isChecked.checked = false;
        }

        // 바닥 줄눈 금액 초기화
        totalPriceComponents.julun_floor = 0;
    }

    // 전체 금액 UI 업데이트
    document.getElementById('julunPriceResult').textContent = 
        `${calculateJulunTotal().toLocaleString()}원`;

    // 총 금액 업데이트
    updateTotalPrice();
}

// 벽 줄눈 초기화
function initializeWallJulunOption(event) {
    if (event && event.type === 'click') {
        // 벽 줄눈 라디오 버튼 초기화
        const radioJulunWall = document.querySelectorAll('input[name="julunWall"]');
        radioJulunWall.forEach(radio => (radio.checked = false));

        // 벽 줄눈 추가 옵션 체크박스 초기화
        const wallMoreCheckboxes = document.querySelectorAll('input[name="julunWallMore"]');
        wallMoreCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });

        // 벽 줄눈 금액 초기화
        totalPriceComponents.julun_wall = 0;
    }

    // 전체 금액 UI 업데이트
    document.getElementById('julunPriceResult').textContent = 
        `${calculateJulunTotal().toLocaleString()}원`;

    // 총 금액 업데이트
    updateTotalPrice();
}

// 실리콘 줄눈 초기화
function initializeSiliconeJulunOption(event) {
    if (event && event.type === 'click') {
        // 욕실 실리콘 줄눈 라디오 버튼 초기화
        const radioBathroomSilicone = document.querySelectorAll('input[name="bathroomJulunSilicone"]');
        radioBathroomSilicone.forEach(radio => (radio.checked = false));

        // 주방 실리콘 줄눈 체크박스 초기화
        const kitchenSiliconeCheckboxes = document.querySelectorAll('input[name="kitchenJulunsilicone"]');
        kitchenSiliconeCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });

        // 실리콘 줄눈 금액 초기화
        totalPriceComponents.julun_silicone = 0;
    }

    // 전체 금액 UI 업데이트
    document.getElementById('julunPriceResult').textContent = 
    `${calculateJulunTotal().toLocaleString()}원`;

    // 총 금액 업데이트
    updateTotalPrice();
}

// 줄눈 전체 초기화 함수
function initializeJulunTotal() {
    // 각 줄눈 초기화 함수 호출
    initializeFloorJulunOption();
    initializeWallJulunOption();
    initializeSiliconeJulunOption();

    // UI 업데이트 (전체 금액 합산 후 반영)
    document.getElementById('julunPriceResult').textContent = 
        `${calculateJulunTotal().toLocaleString()}원`;

    // 총 금액 업데이트
    updateTotalPrice();
}

//---생활코팅---//

function kitchenCoatingPrice() {
    let price = 0;
    const selectedOptions = [];

    // 선택된 라디오 버튼 찾기
    const selectedKitchenCoating = document.querySelector('input[name="kitchenCoating"]:checked');
    if (selectedKitchenCoating) {
        const coatingId = selectedKitchenCoating.id;

        // 디버깅: 선택된 라디오 버튼 정보 확인
        // console.log("선택된 라디오 버튼 ID:", coatingId);

        // coatingPrices에서 해당 ID로 가격 찾기
        if (coatingPrices[coatingId]) {
            price += coatingPrices[coatingId];
            selectedOptions.push(
                document.querySelector(`label[for="${coatingId}"]`).textContent
            );
        } else {
            console.warn(`coatingPrices에 '${coatingId}'가 존재하지 않습니다.`);
        }
    }

    // 결과 저장
    totalPriceComponents.coating_kitchen = price;

    // 디버깅: 계산된 금액과 선택된 옵션 출력
    // console.log("주방 상판 코팅 결과 - 금액:", price, "선택된 옵션:", selectedOptions);

    return { price, selectedOptions };
}

// 나노코팅 금액
function nanoCoatingPrice() {
    let price = 0;
    const selectedOptions = [];

    // 선택된 체크박스 가져오기
    const selectedNanoCoatings = document.querySelectorAll('input[name="nanoCoating"]:checked');
    const selectedIds = Array.from(selectedNanoCoatings).map(checkbox => checkbox.id);

    // 조건: 두 개의 나노 코팅 항목이 모두 선택된 경우
    if (selectedIds.includes('coating2_1') && selectedIds.includes('coating2_2')) {
        price = 330000; // 할인된 가격
        selectedOptions.push('공용 욕실', '안방 욕실 (할인 적용)');
    } else {
        // 개별 선택 항목 계산
        selectedNanoCoatings.forEach(checkbox => {
            if (coatingPrices[checkbox.id]) {
                price += coatingPrices[checkbox.id];
                selectedOptions.push(
                    document.querySelector(`label[for="${checkbox.id}"]`).textContent
                );
            }
        });
    }

    // 결과 저장
    totalPriceComponents.coating_nano = price;

    return { price, selectedOptions };
}

// 바닥 타일코팅 금액
function floorTileCoatingPrice() {
    let price = 0;
    const selectedOptions = [];
    const roomSize = parseInt(document.getElementById('size').value) || 0;

    // 선택된 체크박스 가져오기
    const selectedFloorTiles = document.querySelectorAll('input[name="floorTile"]:checked');
    const selectedIds = Array.from(selectedFloorTiles).map(checkbox => checkbox.id);

    // 조건: 공용 욕실(coating3_1)과 안방 욕실(coating3_2)이 모두 선택된 경우
    if (selectedIds.includes('coating3_1') && selectedIds.includes('coating3_2')) {
        price += 290000; // 할인된 가격
        selectedOptions.push('공용 욕실', '안방 욕실 (할인 적용)');
    } else {
        // 개별 선택 항목 계산
        selectedFloorTiles.forEach(checkbox => {
            let label = document.querySelector(`label[for="${checkbox.id}"]`).textContent;

            if (checkbox.id === 'coating3_3') {
                const areaPrice = roomSize * 33000; // 평당 가격
                price += areaPrice;
                label += ` (${roomSize}평 적용)`;
            } else if (coatingPrices[checkbox.id]) {
                price += coatingPrices[checkbox.id];
            }

            selectedOptions.push(label);
        });
    }

    // 결과 저장
    totalPriceComponents.coating_floorTile = price;

    return { price, selectedOptions };
}

// 벽 타일코팅 금액
function wallTileCoatingPrice() {
    let price = 0;
    const selectedOptions = [];

    // 선택된 체크박스 가져오기
    const selectedWallTiles = document.querySelectorAll('input[name="wallTile"]:checked');
    const selectedIds = Array.from(selectedWallTiles).map(checkbox => checkbox.id);

    // 조건: 두 개의 나노 코팅 항목이 모두 선택된 경우
    if (selectedIds.includes('coating4_3') && selectedIds.includes('coating4_4')) {
        price = 550000; // 할인된 가격
        selectedOptions.push('공용 욕실', '안방 욕실 (할인 적용)');
    } else {
        selectedWallTiles.forEach(checkbox => {
            if (coatingPrices[checkbox.id]) {
                price += coatingPrices[checkbox.id];
                selectedOptions.push(
                    document.querySelector(`label[for="${checkbox.id}"]`).textContent
                );
            }
        });
    }

    // 결과 저장
    totalPriceComponents.coating_wallTile = price;

    return { price, selectedOptions };
}

let kitchenResult;
let nanoResult;
let floorTileResult;
let wallTileResult;

function totalCoatingPrice() {
    // 각 코팅별 계산 결과
    kitchenResult = kitchenCoatingPrice();
    nanoResult = nanoCoatingPrice();
    floorTileResult = floorTileCoatingPrice();
    wallTileResult = wallTileCoatingPrice();

    // 총 금액 계산
    const totalPrice = kitchenResult.price + nanoResult.price + wallTileResult.price + floorTileResult.price;

    // 선택된 옵션 합산
    const selectedCoatingOptions = [
        ...kitchenResult.selectedOptions,
        ...nanoResult.selectedOptions,
        ...wallTileResult.selectedOptions,
        ...floorTileResult.selectedOptions,
    ];

    // 콘솔 출력용 디버깅 정보
    console.log("선택된 옵션:", selectedCoatingOptions);
    console.log("총 코팅 금액:", totalPrice);

    document.getElementById('coatingPriceResult').textContent = `${totalPrice.toLocaleString()}원`;
    updateTotalPrice();
    // 반환 값
    return {
        price: totalPrice,
        selectedOptions: selectedCoatingOptions,
    };
}

function updateDiscount() {
    const discountInput = UIElements.discount_1(); // 할인 금액 호출
    totalPriceComponents.discount = -Math.abs(discountInput); // 음수로 저장
    updateTotalPrice(); // 최종 금액 업데이트
}

// 최종 금액 계산
function updateTotalPrice() {
    const totalPriceResult = document.getElementById('totalPriceResult');
    const total = Object.values(totalPriceComponents).reduce((sum, value) => sum + value, 0);
    totalPriceResult.textContent = `총 합계: ${total.toLocaleString()}원`;
}


//--이벤트 리스너 추가--//
// 할인 이벤트리스너
document.getElementById('discount_1').addEventListener('input', updateDiscount);

// 청소, 마루코팅, 새집증후군

// 평수 입력 업데이트
document.getElementById('size').addEventListener('input', updateUI);

document.getElementById('smallType').addEventListener('change', updateUI);

// 마루코팅 옵션 변경 업데이트
document.getElementById('coatingOption').addEventListener('change', updateUI);


// 새집증후군 체크박스 업데이트
document.getElementById('newHouseSyndrome').addEventListener('change', updateUI);

// 소형 평수 구조 선택
document.querySelectorAll('input[name="structure"]').forEach(radio => {
    radio.addEventListener('change', updateSmallCleaningPrice);
});


document.addEventListener('DOMContentLoaded', () => {
    // 초기화 버튼 클릭 이벤트 연결
    const initializePaintButton = document.getElementById('initializePaint');
    if (initializePaintButton) {
        initializePaintButton.addEventListener('click', handlePaintOption);
    }

    // 라디오 버튼 선택 이벤트 연결
    const paintOptions = document.querySelectorAll('input[name="paintOption"]');
    paintOptions.forEach(option => option.addEventListener('change', handlePaintOption));
});

document.getElementById('initializeJulun_floor').addEventListener('click', initializeFloorJulunOption)
document.getElementById('initializeJulun_wall').addEventListener('click', initializeWallJulunOption)
document.getElementById('initializeJulun_silicone').addEventListener('click', initializeSiliconeJulunOption)
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('initializeJulun').addEventListener('click', initializeJulunTotal);
});


// 각 섹션의 이벤트 리스너 추가
function addCoatingEventListeners() {
    const kitchenSection = document.getElementById('coating-kitchen');
    const nanoSection = document.getElementById('coating-nano');
    const floorTileSection = document.getElementById('coating-floorTile');
    const wallTileSection = document.getElementById('coating-wallTile');
    const roomSizeInput = document.getElementById('size');

    if (kitchenSection) {
        kitchenSection.querySelectorAll('input[type="radio"]').forEach(input => {
            input.addEventListener('change', () => {
                console.log("상판코팅", kitchenResult);
                totalCoatingPrice();
            });
        });
    }

    if (nanoSection) {
        nanoSection.querySelectorAll('input[type="checkbox"]').forEach(input => {
            input.addEventListener('change', () => {
                const { price, selectedOptions } = nanoCoatingPrice(); // 나노코팅 금액 계산 함수 호출
                document.getElementById('coatingPriceResult').textContent = `${price.toLocaleString()}원`;
                console.log("나노코팅 선택:", selectedOptions);
    
                // 총 코팅 금액 업데이트
                totalCoatingPrice();
            });
        });
    }

    if (floorTileSection) {
        floorTileSection.querySelectorAll('input[type="checkbox"]').forEach(input => {
            input.addEventListener('change', () => {
                const { price, selectedOptions } = floorTileCoatingPrice(); // 수정된 함수 호출
                document.getElementById('coatingPriceResult').textContent = `${price.toLocaleString()}원`;
                console.log("바닥 타일코팅 선택:", selectedOptions);
    
                // 총 코팅 금액 업데이트
                totalCoatingPrice();
            });
        });
    }
    if (wallTileSection) {
        wallTileSection.querySelectorAll('input[type="checkbox"]').forEach(input => {
            input.addEventListener('change', () => {
                const { price, selectedOptions } = wallTileCoatingPrice();
                document.getElementById('coatingPriceResult').textContent = `${price.toLocaleString()}원`;
                console.log("벽 타일코팅:", wallTileResult);
                totalCoatingPrice();
            });
        });
    }

    if (roomSizeInput) {
        roomSizeInput.addEventListener('input', totalCoatingPrice);
    }
}

// 코팅 이벤트 리스너 초기화
addCoatingEventListeners();

// 줄눈 이벤트 리스너
function addJulunEventListeners() {
    // 줄눈 옵션 이벤트 리스너
    // 바닥 라디오 버튼 (julun1_1, julun1_2)
    document.querySelectorAll('input[name="julunFloor"]').forEach(radio => {
        radio.addEventListener('change', handleJulunOption);
    });

    // 바닥 체크박스 (julun1_3)
    const julun1_3 = document.getElementById('julun1_3');
    if (julun1_3) {
        julun1_3.addEventListener('change', handleJulunOption);
    }

    // 바닥 평단가 라디오 버튼 (julun1_4, julun1_5)
    document.querySelectorAll('input[name="julunFloorArea"]').forEach(radio => {
        radio.addEventListener('change', handleJulunOption);
    });

    // 벽면 라디오 버튼 (julun2_1, julun2_2)
    document.querySelectorAll('input[name="julunWall"]').forEach(radio => {
        radio.addEventListener('change', handleJulunOption);
    });

    // 벽면 체크박스 (julun2_3, julun2_4, julun2_5)
    document.querySelectorAll('input[name="julunWallMore"]').forEach(checkbox => {
        checkbox.addEventListener('change', handleJulunOption);
    });

    // 실리콘 라디오 버튼 (julun3_1, julun3_2)
    document.querySelectorAll('input[name="bathroomJulunSilicone"]').forEach(radio => {
        radio.addEventListener('change', handleJulunOption);
    });

    // 실리콘 체크박스 (julun3_3)
    const julun3_3 = document.getElementById('julun3_3');
    if (julun3_3) {
        julun3_3.addEventListener('change', handleJulunOption);
    }

    // 평수 입력 변경 이벤트 리스너
    const roomSizeInput = document.getElementById('size');
    if (roomSizeInput) {
        roomSizeInput.addEventListener('input', () => {
            handleJulunOption();
            // totalCoatingPrice();
        });
    }
}

// 줄눈 이벤트 리스너 초기화
addJulunEventListeners();

let lastClickedRadio = null;

function toggleRadio(event) {
    const radio = event.target;

    if (lastClickedRadio === radio) {
        radio.checked = false; // 선택 해제
        lastClickedRadio = null; // 초기화

        // 금액 초기화 (라디오 버튼의 name 속성을 기반으로 설정)
        resetPriceForRadio(radio.name);

        // UI 업데이트
        updateTotalPrice();
    } else {
        lastClickedRadio = radio; // 현재 클릭된 라디오 버튼 저장
    }
}

// 모든 라디오 버튼에 이벤트 리스너 추가
document.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.addEventListener('click', toggleRadio);
});

// 라디오 버튼 그룹에 따른 금액 초기화 함수
function resetPriceForRadio(groupName) {
    if (groupName === 'paintOption') {
        totalPriceComponents.paint = 0;
        document.getElementById('paintPriceResult').textContent = '0원';
    } else if (groupName === 'julunFloor') {
        totalPriceComponents.julun_floor = 0;
        document.getElementById('julunPriceResult').textContent = `${calculateJulunTotal().toLocaleString()}원`;
    } else if (groupName === 'julunFloorArea') {
        // julunFloorArea 계산 로직
        const roomSize = parseInt(document.getElementById('size').value) || 0;
        const selectedFloorArea = document.querySelector('input[name="julunFloorArea"]:checked');

        if (selectedFloorArea) {
            const pricePerPyeong = parseInt(selectedFloorArea.id === 'julun1_4' ? 22000 : 40000); // 거실 또는 거실+방의 평당 가격
            totalPriceComponents.julun_floor = roomSize * pricePerPyeong; // 총 금액 계산
        } else {
            totalPriceComponents.julun_floor = 0; // 선택되지 않았을 때
        }

        // 결과 반영
        document.getElementById('julunPriceResult').textContent = `${totalPriceComponents.julun_floor.toLocaleString()}원`;
    } else if (groupName === 'julunWall') {
        totalPriceComponents.julun_wall = 0;
        document.getElementById('julunPriceResult').textContent = `${calculateJulunTotal().toLocaleString()}원`;
    } else if (groupName === 'bathroomJulunSilicone') {
        totalPriceComponents.julun_silicone = 0;
        document.getElementById('julunPriceResult').textContent = `${calculateJulunTotal().toLocaleString()}원`;
    } else if (groupName === 'kitchenCoating') {
        totalPriceComponents.coating_kitchen = 0;
        document.getElementById('coatingPriceResult').textContent = `0원`;
    }
}

// 바닥 줄눈 평단가 계산 (julunFloorArea) 이벤트 리스너
document.querySelectorAll('input[name="julunFloorArea"]').forEach(radio => {
    radio.addEventListener('change', () => resetPriceForRadio('julunFloorArea'));
});

// 평수 입력 변경 이벤트 리스너
document.getElementById('size').addEventListener('input', () => resetPriceForRadio('julunFloorArea'));


// 버튼 클릭 이벤트 설정
document.getElementById('generateEstimateButton').addEventListener('click', () => {
    displayCustomerInfo(); // 고객 정보 표시
    generateEstimateTable(); // 견적 테이블 생성
});

// 고객 정보를 표시하는 함수
function displayCustomerInfo() {
    const estimateTableContainer = document.getElementById('estimateTableContainer');
    const customerNameElement = document.getElementById('displayCustomer');
    const customerAddressElement = document.getElementById('displayAddress');

    // estimateTableContainer가 숨겨져 있으면 먼저 표시
    if (estimateTableContainer.style.display === 'none') {
        estimateTableContainer.style.display = 'block';
    }

    if (customerNameElement && customerAddressElement) {
        const customerName = document.getElementById('customer').value.trim();
        const customerAddress = document.getElementById('address').value.trim();

        // 입력값이 없으면 기본 메시지 표시
        customerNameElement.textContent = customerName || '고객 이름 미입력';
        customerAddressElement.textContent = customerAddress || '주소 미입력';
    } else {
        console.error('displayCustomer 또는 displayAddress 요소를 찾을 수 없습니다.');
    }
}

// 테이블 생성
function generateEstimateTable() {
    const estimateTableContainer = document.getElementById('estimateTableContainer');
    const tableBody = document.querySelector('#estimateTable tbody');
    const totalPriceElement = document.getElementById('estimateTotalPrice');

    // 기존 테이블 내용을 초기화
    tableBody.innerHTML = '';

    let totalEstimatePrice = 0;
    let rowsAdded = false; // 항목이 추가되었는지 확인


    const formatPrice = (price) => (typeof price === 'number' ? price.toLocaleString() : '0');

    const addEstimateRow = (category, details, price) => {
        if (price > 0) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${category}</td>
                <td>${details}</td>
                <td>${formatPrice(price)}원</td>
            `;
            tableBody.appendChild(row);
            totalEstimatePrice += price;
            rowsAdded = true; // 항목이 추가되었음을 기록
        }
    };

    // 1. 입주청소 (일반 평수 및 소형 평수 구조 처리)
    const sizeInput = document.getElementById('size');
    const sizeValue = sizeInput ? sizeInput.value : 0;

    if (sizeValue > 0) {
        addEstimateRow('입주청소',
            `<div class="detailItem">${document.getElementById('size').value}평 입주청소</div>
            - 지역별 청소전문팀 투입<br>
            - 청소 범위 : 외부창문면을 제외한 내부 전체 공간<br>
            - 배수구 / 환풍구 / 서랍장 / 전등 등 탈거 가능한 설비 : 탈거 후 청소 및 재조립<br>
            - 친환경 세제 사용 / 현장 검수 시 즉시 A/S 처리<br>
            - 추가비용 발생 구간 : 빌트인 가전 내부청소 / 기본 붙박이장 외 내부 청소 추가 / 비확장형 베란다 구조 / 심한 곰팡이,니코틴 오염,스티커류 제거가 필요한 경우 / 리모델링 후 준공청소가 되어있지 않거나, 심한 분진 등 현장의 경우 / 층고가 높은 곳 청소 등 사다리 작업이 추가될 경우 / 공실이 아니거나, 문의주신 평수,일반적인 평수와 다른 경우 / 엘레베이터가 없는 건물인 경우<br>
            -정직하고 유연한 진행 약속 드리겠습니다-`,
            totalPriceComponents.cleaning);
    }

    const selectedStructure = UIElements.selectedStructure();
    if (selectedStructure) {
        const structureLabel = selectedStructure.labels?.[0]?.textContent || '선택된 구조 없음';
        addEstimateRow('소형 평수',
            `<div class="detailItem">${selectedStructure.labels[0].textContent}</div>
            - 지역별 청소전문팀 투입<br>
            - 청소 범위 : 외부창문면을 제외한 내부 전체 공간<br>
            - 배수구 / 환풍구 / 서랍장 / 전등 등 탈거 가능한 설비 : 탈거 후 청소 및 재조립<br>
            - 친환경 세제 사용 / 현장 검수 시 즉시 A/S 처리<br>
            - 추가비용 발생 구간 : 빌트인 가전 내부청소 / 기본 붙박이장 외 내부 청소 추가 / 비확장형 베란다 구조 / 심한 곰팡이,니코틴 오염,스티커류 제거가 필요한 경우 / 리모델링 후 준공청소가 되어있지 않거나, 심한 분진 등 현장의 경우 / 층고가 높은 곳 청소 등 사다리 작업이 추가될 경우 / 공실이 아니거나, 문의주신 평수,일반적인 평수와 다른 경우 / 엘레베이터가 없는 건물인 경우<br>
            -정직하고 유연한 진행 약속 드리겠습니다-`,
            totalPriceComponents.smallCleaning);
    }

    // 2. 마루코팅
    const coatingOption = document.getElementById('coatingOption');
    if (coatingOption && coatingOption.selectedOptions[0].value !== 'noFloorCoating') {
        addEstimateRow('마루코팅',
            `<div class="detailItem">${coatingOption.selectedOptions[0].text}</div>
            - 주방/거실, 방 포함 전구간시공 (팬트리 및 드레스룸)<br>
            - 바닥 정밀세척 작업 포함<br>
            - 코팅제 기본 2회 도포<br>
            - 무상 A/S 기간 : 시공일로부터 1년<br>`,
            totalPriceComponents.floorCoating);
    }

    // 3. 새집증후군
    const newHouseSyndrome = document.getElementById('newHouseSyndrome');
    if (newHouseSyndrome && newHouseSyndrome.checked) {
        addEstimateRow('새집증후군',
            `- 1박2일 작업 진행<br>
            - 입주청소가 완료된 상태 > 16~20시간동안 진행<br>
            - 현장 진단 > 차폐공정 > 액상분해공정 > 오존분해공정 > 피톤치드향균시공 > 시공확인서 발급<br>
            - 베이크아웃 시공 병행<br>
            - 라돈을 포함한 유해물질의 시공 전/후 수치 변화 보고<br>`,
            totalPriceComponents.syndrome);
    }

    // 4. 탄성코트
    const selectedPaint = document.querySelector('input[name="paintOption"]:checked');
    if (selectedPaint) {
        const paintLabel = selectedPaint.labels?.[0]?.textContent || '선택된 옵션 없음';
        addEstimateRow('탄성코트',
            `<div class="detailItem">${selectedPaint.labels[0].textContent}</div>
            - 시공 범위 : 발코니 / 세탁실 / 대피실 / 실외기실 등 외벽과 맞닿은 구간 3개소<br>
            - 친환경 바이오세라믹 코트 시공<br>
            - 샌딩작업 / 퍼티작업 포함 (도장면을 고르게 만들여 하자 발생을 최소화)<br>
            - 삼화페인트/한양페인트 정품 친환경 고급 자재 사용<br>
            - 무상 A/S 기간 : 시공일로부터 1년`,
            totalPriceComponents.paint);
    }

    // 5. 줄눈 시공
    const julunDetails = selectedJulunOptions.length > 0 ? selectedJulunOptions.join('<br>') : '선택된 줄눈 옵션 없음';
    addEstimateRow('줄눈 시공', julunDetails, totalPriceComponents.julun);

    // 6. 생활 코팅
    const coatingDetails = selectedCoatingOptions.length > 0 ? selectedCoatingOptions.join('<br>') : '선택된 옵션 없음';
    addEstimateRow('생활 코팅', coatingDetails, totalPriceComponents.coating);

    // 총합계 업데이트
    totalPriceElement.textContent = `${formatPrice(totalEstimatePrice)}원`;

    // 테이블 컨테이너 표시 여부
    if (rowsAdded) {
        estimateTableContainer.style.display = 'block';
    } else {
        estimateTableContainer.style.display = 'none';
        alert('최소 하나의 항목을 선택해야 견적서를 생성할 수 있습니다.');
    }
}
// PDF 다운로드 버튼 클릭 시 PDF 생성
document.getElementById('downloadEstimatePDF').addEventListener('click', function () {
    const element = document.getElementById('estimateTableContainer');
    const options = {
        margin: 1,
        filename: '견적서.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(options).from(element).save();
});