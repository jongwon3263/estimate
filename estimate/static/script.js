// 최종 금액
let totalPriceComponents = {
    cleaning: 0,
    floorCoating: 0,
    syndrome: 0,
    smallCleaning: 0,
    paint: 0,
    julun: 0,
    coating: 0
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
    coating2_2: 330000,
    //바닥타일
    coating3_1: 190000,
    coating3_2: 290000,
    //벽면타일
    coating4_1: 220000,
    coating4_2: 220000,
    coating4_3: 330000,
    coating4_4: 550000
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
customerName.textContent ? ``: '';

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


// 탄성코트 단일 금액, 최종 금액 업데이트
function updatePaintPrice(event) {
    const selectedPaint = event.target;
    const paintPriceResult = document.getElementById('paintPriceResult');

    if (selectedPaint.name === 'paintOption' && selectedPaint.checked) {
        const selectedPaintPrice = paintPrices[selectedPaint.value]; // 선언 범위를 블록 내로 이동
        paintPriceResult.textContent = `${selectedPaintPrice.toLocaleString()}원`;

        // totalPriceComponents 업데이트는 블록 내부에서 수행
        totalPriceComponents.paint = selectedPaintPrice;
    } else {
        // 선택이 없거나 조건이 맞지 않을 경우 0으로 초기화
        totalPriceComponents.paint = 0;
    }

    updateTotalPrice();
}

let selectedJulunOptions = []; // 선택된 줄눈 옵션을 저장할 배열

// 줄눈가격
function totalJulunPrice() {
    let totalPrice = 0;
    const roomSize = parseInt(document.getElementById('size').value) || 0;

    selectedJulunOptions = []; // 기존 선택된 옵션 초기화

    // 바닥 라디오 버튼 (julun1_1, julun1_2)
    const selectedFloorOption = document.querySelector('input[name="julunFloor"]:checked');
    if (selectedFloorOption && julunPrices[selectedFloorOption.id]) {
        totalPrice += julunPrices[selectedFloorOption.id];
        selectedJulunOptions.push(
            document.querySelector(`label[for="${selectedFloorOption.id}"]`).textContent
        );
    }

    // 바닥 체크박스 (julun1_3)
    const julun1_3 = document.getElementById('julun1_3');
    if (julun1_3.checked && julunPrices[julun1_3.id]) {
        totalPrice += julunPrices[julun1_3.id];
        selectedJulunOptions.push(
            document.querySelector(`label[for="${julun1_3.id}"]`).textContent
        );
    }

    // 바닥 줄눈 평단가 계산 라디오 버튼 (julun1_4, julun1_5)
    const selectedFloorAreaOption = document.querySelector('input[name="julunFloorArea"]:checked');
    if (selectedFloorAreaOption && julunPrices[selectedFloorAreaOption.id]) {
        const areaPrice = roomSize * julunPrices[selectedFloorAreaOption.id];
        totalPrice += areaPrice;
        selectedJulunOptions.push(
            `${document.querySelector(`label[for="${selectedFloorAreaOption.id}"]`).textContent} (${roomSize}평 적용)`
        );
    }


    // 벽면 줄눈 라디오 버튼 (julun2_1, julun2_2)
    const selectedWallOption = document.querySelector('input[name="julunWall"]:checked');
    if (selectedWallOption && julunPrices[selectedWallOption.id]) {
        totalPrice += julunPrices[selectedWallOption.id];
        selectedJulunOptions.push(
            document.querySelector(`label[for="${selectedWallOption.id}"]`).textContent
        );
    }

    // 벽면 체크박스 (julun2_3, julun2_4, julun2_5)
    document.querySelectorAll('input[name="julunWallMore"]:checked').forEach(checkbox => {
        if (julunPrices[checkbox.id]) {
            totalPrice += julunPrices[checkbox.id];
            selectedJulunOptions.push(
                document.querySelector(`label[for="${checkbox.id}"]`).textContent
            );
        }
    });

    // 실리콘 라디오 버튼 (julun3_1, julun3_2)
    const selectedSiliconeOption = document.querySelector('input[name="bathroomJulunSilicone"]:checked');
    if (selectedSiliconeOption && julunPrices[selectedSiliconeOption.id]) {
        totalPrice += julunPrices[selectedSiliconeOption.id];
        selectedJulunOptions.push(
            document.querySelector(`label[for="${selectedSiliconeOption.id}"]`).textContent
        );
    }

    // 실리콘 체크박스 (julun3_3)
    const julun3_3 = document.getElementById('julun3_3');
    if (julun3_3.checked && julunPrices[julun3_3.id]) {
        totalPrice += julunPrices[julun3_3.id];
        selectedJulunOptions.push(
            document.querySelector(`label[for="${julun3_3.id}"]`).textContent
        );
    }

    // UI 업데이트
    document.getElementById('julunPriceResult').textContent = `${totalPrice.toLocaleString()}원`;

    // 총 금액 업데이트
    totalPriceComponents.julun = totalPrice;
    updateTotalPrice();
}

//---생활코팅---//
function calculateCoatingKitchenPrice() {
    let totalPrice = 0;

    // 주방 상판코팅 라디오 버튼 선택
    const selectedKitchenCoating = document.querySelector('input[name="coatingKitchen"]:checked');
    if (selectedKitchenCoating && coatingPrices[selectedKitchenCoating.id]) {
        totalPrice += coatingPrices[selectedKitchenCoating.id];
        selectedCoatingOptions.push(
            document.querySelector(`label[for="${selectedKitchenCoating.id}"]`).textContent
        );
    }

    return totalPrice;
}

function totalCoatingPrice() {
    let totalPrice = 0;
    const roomSize = parseInt(document.getElementById('size').value) || 0;

    selectedCoatingOptions = []; // 기존 선택된 옵션 초기화

    // 주방 상판코팅 라디오 버튼 가격
    totalPrice += calculateCoatingKitchenPrice();

    // 체크박스 옵션 가격 계산
    document.querySelectorAll('#coating-nano input[type="checkbox"], #coating-floorTile input[type="checkbox"], #coating-wallTile input[type="checkbox"]').forEach(checkbox => {
        if (checkbox.checked) {
            let label = document.querySelector(`label[for="${checkbox.id}"]`).textContent;

            if (checkbox.id === 'coating3_3') {
                // 평당 가격 계산
                const areaPrice = roomSize * 33000; // 평당 가격
                totalPrice += areaPrice;
                label += ` (${roomSize}평 적용)`; // 설명에 평수 추가
            } else if (coatingPrices[checkbox.id]) {
                // 일반 체크박스 가격 계산
                totalPrice += coatingPrices[checkbox.id];
            }

            selectedCoatingOptions.push(label); // 선택된 항목 저장
        }
    });

    // UI 업데이트
    document.getElementById('coatingPriceResult').textContent = `${totalPrice.toLocaleString()}원`;

    // 총 금액 업데이트
    totalPriceComponents.coating = totalPrice;
    updateTotalPrice();
}

// 최종 금액 계산
function updateTotalPrice() {
    const totalPriceResult = document.getElementById('totalPriceResult');
    const total = Object.values(totalPriceComponents).reduce((sum, value) => sum + value, 0);
    totalPriceResult.textContent = `총 합계: ${total.toLocaleString()}원`;
}

//--이벤트 리스너 추가--//
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

// 탄성코트 옵션 선택
document.querySelectorAll('input[name="paintOption"]').forEach(radio => {
    radio.addEventListener('change', updatePaintPrice);
});

// 줄눈과 생활코팅 이벤트 리스너
function addEventListeners() {
    // 줄눈 옵션 이벤트 리스너
    // 바닥 라디오 버튼 (julun1_1, julun1_2)
    document.querySelectorAll('input[name="julunFloor"]').forEach(radio => {
        radio.addEventListener('change', totalJulunPrice);
    });

    // 바닥 체크박스 (julun1_3)
    const julun1_3 = document.getElementById('julun1_3');
    if (julun1_3) {
        julun1_3.addEventListener('change', totalJulunPrice);
    }

    // 바닥 평단가 라디오 버튼 (julun1_4, julun1_5)
    document.querySelectorAll('input[name="julunFloorArea"]').forEach(radio => {
        radio.addEventListener('change', totalJulunPrice);
    });

    // 벽면 라디오 버튼 (julun2_1, julun2_2)
    document.querySelectorAll('input[name="julunWall"]').forEach(radio => {
        radio.addEventListener('change', totalJulunPrice);
    });

    // 벽면 체크박스 (julun2_3, julun2_4, julun2_5)
    document.querySelectorAll('input[name="julunWallMore"]').forEach(checkbox => {
        checkbox.addEventListener('change', totalJulunPrice);
    });

    // 실리콘 라디오 버튼 (julun3_1, julun3_2)
    document.querySelectorAll('input[name="bathroomJulunSilicone"]').forEach(radio => {
        radio.addEventListener('change', totalJulunPrice);
    });

    // 실리콘 체크박스 (julun3_3)
    const julun3_3 = document.getElementById('julun3_3');
    if (julun3_3) {
        julun3_3.addEventListener('change', totalJulunPrice);
    }

    // 생활 코팅 옵션 이벤트 리스너
    // 주방 상판 코팅 라디오 버튼
    document.querySelectorAll('input[name="coatingKitchen"]').forEach(radio => {
        radio.addEventListener('change', totalCoatingPrice);
    });

    // 코팅 체크박스 (nano, floorTile, wallTile)
    document.querySelectorAll('#coating-nano input[type="checkbox"], #coating-floorTile input[type="checkbox"], #coating-wallTile input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', totalCoatingPrice);
    });

    // 평수 입력 변경 이벤트 리스너
    const roomSizeInput = document.getElementById('size');
    if (roomSizeInput) {
        roomSizeInput.addEventListener('input', () => {
            totalJulunPrice();
            totalCoatingPrice();
        });
    }
}

// 이벤트 리스너 추가 초기화
addEventListeners();

// 이벤트 리스너 초기화 호출
// addJulunEventListeners();

document.getElementById('generateEstimateButton').addEventListener('click', generateEstimateTable);

//새로운 코드
function generateEstimateTable() {
    const tableBody = document.querySelector('#estimateTable tbody');
    const totalPriceElement = document.getElementById('estimateTotalPrice');
    const estimateTableContainer = document.getElementById('estimateTableContainer');

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
        alert('최소 하나의 항목을 선택해야 견적서를 생성할 수 있습니다.');
        estimateTableContainer.style.display = 'none';
    }
}


// 테이블 PDF 생성
document.getElementById('downloadEstimatePDF').addEventListener('click', async () => {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    // 텍스트 파일에서 Base64 데이터 로드
    const response = await fetch('/static/font/NanumGothic_base64.txt');
    const base64Font = await response.text();

    // PDF에 폰트 추가
    pdf.addFileToVFS('NanumGothic.ttf', base64Font);
    pdf.addFont('NanumGothic.ttf', 'NanumGothic', 'normal');
    pdf.setFont('NanumGothic');

    // HTML 테이블 데이터 가져오기
    const table = document.getElementById('estimateTable');
    const rows = Array.from(table.rows).map(row =>
        Array.from(row.cells).map(cell =>
            cell.innerHTML
                .replace(/<br\s*\/?>/g, '\n')
                .replace(/\n\s+/g, '\n')
                .trim()
        )
    );

    // PDF에 테이블 추가
    pdf.autoTable({
        head: [rows[0]],
        body: rows.slice(1),
        theme: 'grid',
        styles: {
            font: 'NanumGothic',
            fontSize: 12,
            cellPadding: 1,
            lineHeight: 3.5, // 줄 간격 조정
        },
        headStyles: {
            fillColor: [0, 123, 255],
            textColor: [255, 255, 255],
            fontSize: 14,
            fontStyle: 'bold',
        },
        bodyStyles: { 
            fillColor: [245, 245, 245],
            textColor: [0, 0, 0],
            cellPadding: 2,
            margin: 10
            
        },
        columnStyles: {
            0: { cellWidth: 30 },
            2: { halign: 'center', cellWidth: 30 },
        }
    });

    // PDF 저장
    pdf.save('estimate.pdf');
});