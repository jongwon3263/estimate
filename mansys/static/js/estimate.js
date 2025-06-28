document.addEventListener('DOMContentLoaded', function () {
    const roomTypeSelect = document.getElementById('selectRoomType');
    const selectedRoomTypeId = roomTypeSelect.value;
    const inputPyeongDiv = document.getElementById('inputPyeong');
    const smallTypeDiv = document.getElementById('smallType');
    const pyeong = document.getElementById('pyeong');
    const pyeongValue = parseFloat(document.getElementById('pyeong').value) || 0;
    function getPyeongValue() {
        return parseFloat(document.getElementById('pyeong').value) || 0;
    }
    const smallRoomTypeSelector = document.getElementById('smallRoomTypeSelector');

    //시공 선택 컨테이너
    const serviceSelector = document.getElementById('serviceSelector');

    //시공 선택 체크박스
    const checkCleaning = document.getElementById('checkCleaning');
    const checkGrouting = document.getElementById('checkGrouting');
    const checkKera = document.getElementById('checkKera');
    const checkNewhouse = document.getElementById('checkNewhouse');
    const checkPainting = document.getElementById('checkPainting');
    const checkCoating = document.getElementById('checkCoating');
    const checkFloorCoating = document.getElementById('checkFloorCoating');
    const checkAppliance = document.getElementById('checkAppliance');
    
    //시공별 컨테이너
    const cleaningContainer = document.getElementById('cleaning-container');
    const groutContainer = document.getElementById('grouting-container');
    const keraContainer = document.getElementById('kera-container');
    const newhouseContainer = document.getElementById('newhouse-container');
    const paintContainer = document.getElementById('paint-container');
    const coatingContainer = document.getElementById('coating-container');
    const floorCoatingContainer = document.getElementById('floorCoating-container');

    //시공별 금액
    const cleaningPriceDiv = document.getElementById('cleaningPrice');
    //줄눈
    const groutPriceFloor = document.getElementById('groutPriceFloor');
    const groutPriceWall = document.getElementById('groutPriceWall');
    const groutPriceSilicone = document.getElementById('groutPriceSilicone');
    const groutPriceTotal = document.getElementById('groutPriceTotal');
    //케라
    const keraPriceFloor = document.getElementById('keraPriceFloor');
    const keraPriceWall = document.getElementById('keraPriceWall');
    const keraPriceTotal = document.getElementById('keraPriceTotal');
    //새집
    const newhousePrice = document.getElementById('newhousePrice');
    //탄성
    const paintPrice = document.getElementById('paintPrice');
    //마루코팅
    const floorCoatingPrice = document.getElementById('floorCoatingPrice');
    //코팅
    const coatingPriceCountertop = document.getElementById('coatingPriceCountertop');
    const coatingPriceNano = document.getElementById('coatingPriceNano');
    const coatingPriceFloorTile = document.getElementById('coatingPriceFloorTile');
    const coatingPriceWallTile = document.getElementById('coatingPriceWallTile');
    const coatingPriceTotal = document.getElementById('coatingPriceTotal');
    //가전
    const airconPrice = document.getElementById('apAirconPrice');
    const washingmachinePrice = document.getElementById('apWashingmachinePrice');
    const apPrice = document.getElementById('apPrice');

    //패키지 관련
    //줄눈
    const gr_1_2 = document.getElementById('gr_1_2');
    const gr_1_1 = document.getElementById('gr_1_1'); //욕실 1개소
    const gr_2_3 = document.getElementById('gr_2_3'); //샤워부스 안쪽 벽면
    const gr_2_2 = document.getElementById('gr_2_2');
    const gr_2_1 = document.getElementById('gr_2_1'); //욕실 벽면 전체 1개
    const gr_2_4 = document.getElementById('gr_2_4'); //욕조 라인 벽면
    //줄눈 패키지
    const gr_9_1 = document.getElementById('gr_9_1'); //베이직
    const gr_9_2 = document.getElementById('gr_9_2'); //스탠다드
    const gr_9_3 = document.getElementById('gr_9_3'); //프리미엄

    //케라
    const kp_1_1 = document.getElementById('kp_1_1'); //현관
    const kp_1_3 = document.getElementById('kp_1_3'); //욕실 바닥 2개
    const kp_2_3 = document.getElementById('kp_2_3'); //샤워부스 안쪽 벽면
    const kp_1_2 = document.getElementById('kp_1_2'); //욕실 바닥 1개
    const kp_2_1 = document.getElementById('kp_2_1'); //욕실 벽면 전체 1개
    const kp_2_2 = document.getElementById('kp_2_2'); //욕실 벽면 전체 2개
    const kp_2_4 = document.getElementById('kp_2_4'); //욕조 라인 벽면
    //케라 패키지
    const kp_9_1 = document.getElementById('kp_9_1'); //베이직
    const kp_9_2 = document.getElementById('kp_9_2'); //스탠다드
    const kp_9_3 = document.getElementById('kp_9_3'); //프리미엄

    //코팅
    const ct_2_1 = document.getElementById('ct_2_1'); //나노코팅 1개
    const ct_2_2 = document.getElementById('ct_2_2'); //나노코팅 2개
    const ct_3_1 = document.getElementById('ct_3_1'); //바닥타일 코팅 1개
    const ct_3_2 = document.getElementById('ct_3_2'); //바닥타일 코팅 2개
    const ct_4_2 = document.getElementById('ct_4_2'); //샤워부스 안쪽 벽면 1개
    const ct_4_3 = document.getElementById('ct_4_3'); //욕실 벽면 전체 1개
    const ct_4_4 = document.getElementById('ct_4_4'); //욕실 벽면 전체 2개
    //코팅 패키지   
    const ct_9_1 = document.getElementById('ct_9_1'); //베이직
    const ct_9_2 = document.getElementById('ct_9_2'); //스탠다드
    const ct_9_3 = document.getElementById('ct_9_3'); //프리미엄

    let isPackageGR1 = false;
    let isPackageGR2 = false;
    let isPackageGR3 = false;
    let isPackageGR = false;
    //케라
    let isPackageKP1 = false;
    let isPackageKP2 = false;
    let isPackageKP3 = false;
    let isPackageKP = false;
    //코팅
    let isPackageCT1 = false;
    let isPackageCT2 = false;
    let isPackageCT3 = false;
    let isPackageCT = false;
    
    const packageGR1 = document.getElementById('packageGR1');
    const packageGR2 = document.getElementById('packageGR2');
    const packageGR3 = document.getElementById('packageGR3');


    //체크박스 체크 여부에 따른 옆 체크박스 비활성화
    const pairs = [
        ['gr_1_1', 'gr_1_2'],
        ['gr_1_7', 'gr_1_8'],
        ['gr_2_1', 'gr_2_2'],
        ['gr_3_3', 'gr_3_4'],
        ['kp_1_8', 'kp_1_9'],
        ['ct_1_1', 'ct_1_2'],
        ['ct_2_1', 'ct_2_2'],
        ['ct_3_1', 'ct_3_2'],
        ['ct_4_3', 'ct_4_4'],
        ['kp_2_1', 'kp_2_2'],
        ['kp_1_2', 'kp_1_3'],
    ];
    pairs.forEach(([id1, id2]) => {
        const el1 = document.getElementById(id1);
        const el2 = document.getElementById(id2);

        el1.addEventListener('change', () => el2.disabled = el1.checked);
        el2.addEventListener('change', () => el1.disabled = el2.checked);
    });

    //패키지 선택시 나머지 패키지 비활성화
    const packageCheckboxGroups = [
        ['gr_9_1', 'gr_9_2', 'gr_9_3'],
        ['kp_9_1', 'kp_9_2', 'kp_9_3'],
        ['ct_9_1', 'ct_9_2', 'ct_9_3'],
    ];

    packageCheckboxGroups.forEach(group => {
        const elements = group.map(id => document.getElementById(id)).filter(el => el !== null);

        elements.forEach((el, idx) => {
            el.addEventListener('change', () => {
                if (el.checked) {
                    // 체크된 항목을 제외한 나머지 2개 해제 및 비활성화
                    elements.forEach((otherEl, otherIdx) => {
                        if (otherIdx !== idx) {
                            otherEl.checked = false;
                            otherEl.disabled = true;
                        }
                    });
                } else {
                    // 해제되면 다시 전체 활성화
                    const anyChecked = elements.some(e => e.checked);
                    if (!anyChecked) {
                        elements.forEach(e => e.disabled = false);
                    }
                }
            });
        });
    });

    const bathroomWallOptions = [
        ['gr_2_2', 'gr_2_3', 'gr_2_4'],
        ['kp_2_2', 'kp_2_3', 'kp_2_4'],
        ['ct_4_4', 'ct_4_2', 'ct_4_3'],
    ]
    bathroomWallOptions.forEach(([id1, id2, id3]) => {
        const el1 = document.getElementById(id1);
        const el2 = document.getElementById(id2);
        const el3 = document.getElementById(id3);

        el1.addEventListener('change', () => {
            if (el1.checked) {
                // el2와 el3 체크 해제
                if (el2.checked) el2.checked = false;
                if (el3.checked) el3.checked = false;
                el2.disabled = true;
                el3.disabled = true;
            } else {
                el2.disabled = false;
                el3.disabled = false;
            }
        })
    });

    
    //시공 선택 보이기
    pyeong.addEventListener('input', function () {
        serviceSelector.classList.remove('hide');
    });


    

    // 집 구조 선택
    roomTypeSelect.addEventListener('change', function () {

        const selected = roomTypeSelect.value;
        if (selected === 'normalType') {
            inputPyeongDiv.classList.remove('hide');
            smallTypeDiv.classList.add('hide');
        } else if (selected === 'smallType') {
            pyeong.value = '';
            smallTypeDiv.classList.remove('hide');
            inputPyeongDiv.classList.add('hide');
        } else  {
            pyeong.value = '';
            inputPyeongDiv.classList.add('hide');
            smallTypeDiv.classList.add('hide');
        }
    });

    //청소 가격 표시
    checkCleaning.addEventListener('change', function (event) {
        
        if (!cleaningContainer) {
            console.warn('❗️cleaning-container를 찾을 수 없습니다.');
            return;
        }

        const isChecked = event.target.checked;

        if (isChecked) {
            cleaningContainer.classList.remove('hide');
        } else {
            cleaningPriceDiv.textContent = '';
            final();
            cleaningContainer.classList.add('hide');
        }

        

        if (!isChecked) {
            cleaningPriceDiv.textContent = '';
            return;
        }

        if (roomTypeSelect.value === 'normalType' && !isNaN(pyeongValue)) {
            fetch('/api/get_price?service_id=CL&option_id=1')
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        const total = data.price * getPyeongValue();
                        cleaningPriceDiv.textContent = `${total.toLocaleString()}원`;
                        final();
                    } else {
                        cleaningPriceDiv.textContent = '가격 정보를 불러올 수 없습니다.';
                    }
                });

        } else if (roomTypeSelect.value === 'smallType') {
            const selectedOption = smallRoomTypeSelector.options[smallRoomTypeSelector.selectedIndex];
            if (selectedOption && selectedOption.value !== "") {
                const parts = selectedOption.id.split('_'); 
                const serviceId = parts[0];          
                const categoryCode = parts[1];    
                const optionCode = parts[2];      
                console.log(serviceId, categoryCode, optionCode);

                fetch(`/api/get_price?service_id=CL&category_code=${categoryCode}&option_code=${optionCode}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            cleaningPriceDiv.textContent = `${data.price.toLocaleString()}원`;
                            final();
                        } else {
                            cleaningPriceDiv.textContent = '가격 정보를 불러올 수 없습니다.';
                        }
                    })
                    .catch(err => {
                        console.error('요청 오류:', err);
                        cleaningPriceDiv.textContent = '서버 오류 발생';
                    });
                } else {
                    cleaningPriceDiv.textContent = '구조를 선택해주세요.';
                }
        } else {
            cleaningPriceDiv.textContent = '';
        }
    });


    // 방 구조 후선택
    smallRoomTypeSelector.addEventListener('change', function () {

        if (smallRoomTypeSelector.value !== '') {
            //시공 선택 컨테이너 보이기
            serviceSelector.classList.remove('hide');
        } else {
            // 선택된 구조가 없을 때
            serviceSelector.classList.add('hide');
        }
        
        const selectedOption = smallRoomTypeSelector.options[smallRoomTypeSelector.selectedIndex];
        const selectedId = selectedOption.id;
        console.log('룸 id:', selectedId);
        

        if (checkCleaning.checked && selectedOption.value !== "") {
            const parts = selectedOption.id.split('_'); 
            const serviceId = parts[0];          
            const categoryCode = parts[1];    
            const optionCode = parts[2];      
            console.log(serviceId, categoryCode, optionCode);

            fetch(`/api/get_price?service_id=CL&category_code=${categoryCode}&option_code=${optionCode}`)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        cleaningPriceDiv.textContent = `${data.price.toLocaleString()}원`;
                        final();
                    } else {
                        cleaningPriceDiv.textContent = '가격 정보를 불러올 수 없습니다.';
                    }
                })
                .catch(err => {
                    console.error('요청 오류:', err);
                    cleaningPriceDiv.textContent = '서버 오류 발생';
                });
            } else {
                cleaningPriceDiv.textContent = '';
            }
        
        if (checkNewhouse.checked && selectedOption.value !== "") {
            const parts = selectedOption.id.split('_'); 
            const serviceId = parts[0];          
            const categoryCode = parts[1];    
            const optionCode = parts[2];      
            console.log(serviceId, categoryCode, optionCode);

            fetch(`/api/get_price?service_id=NH&option_code=${optionCode}`)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        newhousePrice.textContent = `${data.price.toLocaleString()}원`;
                        final();
                    } else {
                        newhousePrice.textContent = '가격 정보를 불러올 수 없습니다.';
                    }
                })
                .catch(error => {
                    console.error('가격 요청 오류:', error);
                    newhousePrice.textContent = '서버 오류 발생';
                });
            } else {
                newhousePrice.textContent = '';
            }

    });


    // 새집증후군
    
    if (checkNewhouse) {
        checkNewhouse.addEventListener('change', function (event) {
            const isChecked = event.target.checked;

            if (isChecked) {
                newhouseContainer.classList.remove('hide');
                const pyeong = parseFloat(document.getElementById('pyeong').value) || 0;
                
                // 집 구조가 일반 평수일 때만 가격 계산
                if (roomTypeSelect.value === 'normalType') {
                    fetch(`/api/get_price?service_id=NH&category_code=1&option_code=1`)
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                const total = data.price * pyeong;
                                newhousePrice.textContent = `${total.toLocaleString()}원`;
                                final();
                            } else {
                                newhousePrice.textContent = '가격 정보를 불러올 수 없습니다.';
                            }
                        })
                        .catch(error => {
                            console.error('가격 요청 오류:', error);
                            newhousePrice.textContent = '서버 오류 발생';
                        });
                } else if (roomTypeSelect.value === 'smallType') {
                    const selectedOption = smallRoomTypeSelector.options[smallRoomTypeSelector.selectedIndex];
                    if (selectedOption && selectedOption.value !== "") {
                        const parts = selectedOption.id.split('_'); 
                        const serviceId = parts[0];          
                        const categoryCode = parts[1];    
                        const optionCode = parts[2];      
                        console.log(serviceId, categoryCode, optionCode);

                        fetch(`/api/get_price?service_id=NH&option_code=${optionCode}`)
                            .then(response => response.json())
                            .then(data => {
                                if (data.success) {
                                    newhousePrice.textContent = `${data.price.toLocaleString()}원`;
                                    final();
                                } else {
                                    newhousePrice.textContent = '가격 정보를 불러올 수 없습니다.';
                                }
                            })
                            .catch(error => {
                                console.error('가격 요청 오류:', error);
                                newhousePrice.textContent = '서버 오류 발생';
                            });
                        } else {
                            newhousePrice.textContent = '구조를 선택해주세요.';
                        }
                }
            } else {
                newhousePrice.textContent = '';
                final();
                newhouseContainer.classList.add('hide');
            }
        });
    }


    //줄눈시공
    //컨테이너 보이기

    if(checkGrouting && groutContainer) {
        checkGrouting.addEventListener('change', function(event){
            const isChecked = event.target.checked;
            // console.log('✅ 줄눈시공 체크 상태:', isChecked);
            if(isChecked) {
                groutContainer.classList.remove('hide');
            } else {
                groutContainer.classList.add('hide');
            }
        })
    } else {
        console.warn('❗️checkGrouting 또는 grouting-container 요소를 찾지 못했습니다.');
    }
    //패키지 박스
    const gr_package_checkboxs = document.querySelectorAll('.gr_package_checkbox');

    gr_package_checkboxs.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const isChecked = checkbox.checked;

            // 체크된 경우: 패키지에 해당하는 항목 자동 체크
            if (this.id === 'gr_9_1' && isChecked) {
                gr_1_2.checked = true;
                gr_2_2.checked = false;
                gr_2_3.checked = false;
                gr_1_1.disabled = true;
            } else if (this.id === 'gr_9_2' && isChecked) {
                gr_1_2.checked = true;
                gr_2_3.checked = true;
                gr_2_2.checked = false;
                gr_1_1.disabled = true;
            } else if (this.id === 'gr_9_3' && isChecked) {
                gr_1_2.checked = true;
                gr_2_2.checked = true;
                gr_2_3.checked = false;
                gr_1_1.disabled = true;
                gr_2_1.disabled = true; // 욕실 벽면 전체 1개는 비활성화
                gr_2_3.disabled = true; // 샤워부스 안쪽 벽면은 비활성화
                gr_2_4.disabled = true; // 욕조 라인 벽면은 비활성화
            }

            // 체크 해제된 경우: 패키지가 강제 체크한 항목들만 해제
            if (!isChecked) {
                if (this.id === 'gr_9_1') {
                    gr_1_2.checked = false;
                    gr_1_1.disabled = false;
                } else if (this.id === 'gr_9_2') {
                    gr_1_2.checked = false;
                    gr_2_3.checked = false;
                    gr_1_1.disabled = false;
                } else if (this.id === 'gr_9_3') {
                    gr_1_2.checked = false;
                    gr_2_2.checked = false;
                    gr_1_1.disabled = false;
                    gr_2_1.disabled = false; // 욕실 벽면 전체 1개는 비활성화
                    gr_2_3.disabled = false; // 샤워부스 안쪽 벽면은 비활성화
                    gr_2_4.disabled = false; // 욕조 라인 벽면은 비활성화
                }
            }

            updateGroutPrice(); // 변경 후 가격 업데이트
        });
    });

    //바닥, 벽, 실리콘 줄눈 계산
    const grCheckboxes = document.querySelectorAll('.gr_checkbox');

    grCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateGroutPrice);
    });

    async function updateGroutPrice() {

        isPackageGR1 = gr_1_2.checked && !gr_2_3.checked && !gr_2_2.checked; //베이직
        isPackageGR2 = gr_1_2.checked && gr_2_3.checked; //스탠다드
        isPackageGR3 = gr_1_2.checked && gr_2_2.checked; //프리미엄
        isPackageGR = isPackageGR1 || isPackageGR2 || isPackageGR3;

        let floorTotal = 0;
        let wallTotal = 0;
        let siliconeTotal = 0;
        let packagePrice = 0;

        //패키지 선택 여부
        let optionCode = null;

        if (isPackageGR2) {
            optionCode = 2;
        } else if (isPackageGR3) {
            optionCode = 3;
        } else if (isPackageGR1) {
            optionCode = 1;
        }

        // ✅ 패키지 가격 가져오기
        if (optionCode!== null) {

            try {
                const response = await fetch(`/api/get_price?service_id=GR&category_code=9&option_code=${optionCode}`);
                const data = await response.json();
                if (data.success) {
                    packagePrice = data.price;
                }
            } catch (error) {
                console.error('패키지 가격 요청 실패', error);
            }
        }

        // ✅ 각 항목별 가격 계산
        for (const checkbox of grCheckboxes) {
            if (checkbox.checked) {
                const parts = checkbox.id.split('_');
                const serviceId = parts[0];
                const serviceIdUpper = serviceId.toUpperCase();
                const categoryCode = parts[1];
                const optionCode = parts[2];
                console.log(checkbox.id);

                // ✅ 패키지가 선택되었고, 이 항목이 패키지에 포함된 항목이면 무시
                if (isPackageGR) {
                    // 예: 스탠다드 패키지 선택 시 gr_1_2 + gr_2_3 체크됨
                    //     프리미엄 패키지 선택 시 gr_1_2 + gr_2_2
                    const isIncludedInPackage =
                        (isPackageGR1 && checkbox.id === 'gr_1_2') ||
                        (isPackageGR2 && (checkbox.id === 'gr_1_2' || checkbox.id === 'gr_2_3')) ||
                        (isPackageGR3 && (checkbox.id === 'gr_1_2' || checkbox.id === 'gr_2_2'));

                    if (isIncludedInPackage) {
                        continue; // 이 항목은 패키지에 포함되었으므로 건너뛴다
                    }
                }

                try {
                    const response = await fetch (`/api/get_price?service_id=${serviceIdUpper}&category_code=${categoryCode}&option_code=${optionCode}`);
                    const data = await response.json();
                    if (data.success) {
                        const floorGroutingSelected = checkbox.id == 'gr_1_7' || checkbox.id == 'gr_1_8';
                        if (isPackageGR) {
                            const discounted = data.discounted_price ?? 0;
                            const price = discounted > 0 ? discounted : data.price;

                            if (floorGroutingSelected) {
                                floorTotal += price * getPyeongValue();
                            } else if (categoryCode == '1') {
                                floorTotal += price;
                            } else if (categoryCode == '2') {
                                wallTotal += price;
                            } else if (categoryCode == '3') {
                                siliconeTotal += price;
                            }
                        } else {
                            if (floorGroutingSelected) {
                                floorTotal += data.price * getPyeongValue();
                            } else if (categoryCode == '1') {
                                floorTotal += data.price;
                            } else if (categoryCode == '2') {
                                wallTotal += data.price;
                            } else if (categoryCode == '3') {
                                siliconeTotal += data.price;
                            }
                        }

                    }
                } catch (error) {
                    console.error(`가격 요청 실패 ${checkbox.id}`, error);
                }
            }
        }

        const groutTotal = floorTotal + wallTotal + siliconeTotal + packagePrice;
        
        
        groutPriceFloor.textContent = floorTotal > 0 ? `${floorTotal.toLocaleString()}원` : '0원';
        groutPriceWall.textContent = wallTotal > 0 ? `${wallTotal.toLocaleString()}원` : '0원';
        groutPriceSilicone.textContent = siliconeTotal > 0 ? `${siliconeTotal.toLocaleString()}원` : '0원';
        groutPriceTotal.textContent = groutTotal > 0 ? `토탈 ${groutTotal.toLocaleString()}원` : '0원';
        final();
    }


    //케라폭시
    //컨테이너 보이기
    if(checkKera && keraContainer) {
        checkKera.addEventListener('change', function(event){
            const isChecked = event.target.checked;
            // console.log('✅ 줄눈시공 체크 상태:', isChecked);
            if(isChecked) {
                keraContainer.classList.remove('hide');
            } else {
                keraContainer.classList.add('hide');
            }
        })
    } else {
        console.warn('checkKera 또는 kera-container 요소를 찾지 못했습니다.');
    }
    //패키지 박스
    const kp_package_checkbox = document.querySelectorAll('.kp_package_checkbox');

    kp_package_checkbox.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const isChecked = checkbox.checked;

            // 체크된 경우: 패키지에 해당하는 항목 자동 체크
            if (this.id === 'kp_9_1' && isChecked) {
                // 베이직
                kp_1_1.checked = true;
                kp_1_3.checked = true;
                kp_2_3.checked = false;
                kp_1_2.disabled = true; // 욕실 바닥 1개는 비활성화
            } else if (this.id === 'kp_9_2' && isChecked) {
                // 스탠다드
                kp_1_1.checked = true;
                kp_1_3.checked = true;
                kp_2_3.checked = true;
                kp_1_2.disabled = true; // 욕실 바닥 1개는 비활성화
                kp_2_2.checked = false;
            } else if (this.id === 'kp_9_3' && isChecked) {
                // 프리미엄
                kp_1_1.checked = true;
                kp_1_3.checked = true;
                kp_2_3.checked = false;
                kp_2_2.checked = true;
                kp_1_2.disabled = true; // 욕실 바닥 1개는 비활성화
                kp_2_1.disabled = true; // 욕실 벽면 전체 1개는 비활성화
                kp_2_3.disabled = true; // 샤워부스 안쪽 벽면은 비활성화
                kp_2_4.disabled = true; // 욕조 라인 벽면은 비활성화

            }

            // 체크 해제된 경우: 패키지가 강제 체크한 항목들만 해제
            if (!isChecked) {
                if (this.id === 'kp_9_1') {
                    // 베이직
                    kp_1_1.checked = false;
                    kp_1_3.checked = false;
                    kp_1_2.disabled = false;
                } else if (this.id === 'kp_9_2') {
                    kp_1_1.checked = false;
                    kp_1_3.checked = false;
                    kp_2_3.checked = false;
                    kp_1_2.disabled = false;
                } else if (this.id === 'kp_9_3') {
                    kp_1_1.checked = false;
                    kp_1_3.checked = false;
                    kp_2_3.checked = false;
                    kp_2_2.checked = false;
                    kp_1_2.disabled = false;
                    kp_2_1.disabled = false; // 욕실 벽면 전체 1개는 비활성화
                    kp_2_3.disabled = false; // 샤워부스 안쪽 벽면은 비활성화
                    kp_2_4.disabled = false; // 욕조 라인 벽면은 비활성화
                }
            }

            updateKeraPrice(); // 변경 후 가격 업데이트
        });
    });

    //바닥, 벽 케라 계산
    const kpCheckboxes = document.querySelectorAll('.kp_checkbox');


    kpCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateKeraPrice);
    });

    async function updateKeraPrice() {

        isPackageKP1 = (kp_1_1.checked && kp_1_3.checked && !kp_2_3.checked && !kp_2_2.checked) || kp_9_1.checked; //베이직
        isPackageKP2 = (kp_1_1.checked && kp_1_3.checked && kp_2_3.checked) || kp_9_2.checked; //스탠다드
        isPackageKP3 = (kp_1_1.checked && kp_1_3.checked && kp_2_2.checked) || kp_9_3.checked; //프리미엄
        isPackageKP = isPackageKP1 || isPackageKP2 || isPackageKP3;

        let floorTotal = 0;
        let wallTotal = 0;
        let packagePrice = 0;

        //패키지 선택 여부
        let optionCode = null;

        if (isPackageKP2) {
            optionCode = 2;
        } else if (isPackageKP3) {
            optionCode = 3;
        } else if (isPackageKP1) {
            optionCode = 1;
        }

        // ✅ 패키지 가격 가져오기
        if (optionCode!== null) {
            try {
                const response = await fetch(`/api/get_price?service_id=KP&category_code=9&option_code=${optionCode}`);
                const data = await response.json();
                if (data.success) {
                    packagePrice = data.price;
                }
            } catch (error) {
                console.error('패키지 가격 요청 실패', error);
            }
        }

        const pyeong = parseFloat(document.getElementById('pyeong').value) || 0;

        for (const checkbox of kpCheckboxes) {
            if (checkbox.checked) {
                const parts = checkbox.id.split('_');
                const serviceId = parts[0];
                const serviceIdUpper = parts[0].toUpperCase();
                const categoryCode = parts[1];
                const optionCode = parts[2];

                // ✅ 항목 중복 방지: 패키지에 포함된 항목은 계산에서 제외
                if (isPackageKP) {
                    const isIncludedInPackage =
                        (isPackageKP1 && (checkbox.id === 'kp_1_1' || checkbox.id === 'kp_1_3')) ||
                        (isPackageKP2 && (checkbox.id === 'kp_1_1' || checkbox.id === 'kp_1_3' || checkbox.id === 'kp_2_3')) ||
                        (isPackageKP3 && (checkbox.id === 'kp_1_1' || checkbox.id === 'kp_1_3' || checkbox.id === 'kp_2_2'));

                    if (isIncludedInPackage) {
                        continue;
                    }
                }

                try {
                    const response = await fetch (`/api/get_price?service_id=${serviceIdUpper}&category_code=${categoryCode}&option_code=${optionCode}`);
                    const data = await response.json();
                    if (data.success) {
                        const floorKeraSelected = checkbox.id == 'kp_1_8' || checkbox.id == 'kp_1_9';
                        if (isPackageKP) {
                            const discounted = data.discounted_price ?? 0;
                            const price = discounted > 0 ? discounted : data.price;

                            if (floorKeraSelected) {
                                floorTotal += price * pyeong;
                            } else if (categoryCode == '1') {
                                floorTotal += price;
                            } else if (categoryCode == '2') {
                                wallTotal += price;
                            }
                        } else {
                            if (floorKeraSelected) {
                                floorTotal += data.price * pyeong;
                            } else if (categoryCode == '1') {
                                floorTotal += data.price;
                            } else if (categoryCode == '2') {
                                wallTotal += data.price;
                            }
                        }

                        // const price = (checkbox.id === `${serviceId}_1_7` || checkbox.id === `${serviceId}_1_8`)
                        //     ? data.price * pyeong
                        //     : data.price;
                        // if (categoryCode == '1') {
                        //     floorTotal += price;
                        // } else if (categoryCode == '2') {
                        //     wallTotal += price;
                        // }

                    }
                } catch (error) {
                    console.error(`가격 요청 실패 ${checkbox.id}`, error);
                }
            }
        }

        const keraTotal = floorTotal + wallTotal + packagePrice;
        
        
        keraPriceFloor.textContent = floorTotal > 0 ? `${floorTotal.toLocaleString()}원` : '0원';
        keraPriceWall.textContent = wallTotal > 0 ? `${wallTotal.toLocaleString()}원` : '0원';
        keraPriceTotal.textContent = keraTotal > 0 ? `토탈 ${keraTotal.toLocaleString()}원` : '0원';
        final();
    }

    //생활코팅
    
    checkCoating.addEventListener('change', function(event){
        const isChecked = event.target.checked;
        if (isChecked) {
            coatingContainer.classList.remove('hide');
        } else {
            coatingContainer.classList.add('hide');
        }
    })

    //패키지 박스
    const ct_package_checkbox = document.querySelectorAll('.ct_package_checkbox');

    ct_package_checkbox.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const isChecked = checkbox.checked;

            // 체크된 경우: 패키지에 해당하는 항목 자동 체크
            if (this.id === 'ct_9_1' && isChecked) {
                // 베이직
                ct_2_2.checked = true; // 나노코팅 2개
                ct_3_2.checked = true; // 바닥타일 코팅 2개
                ct_2_1.disabled = true; // 나노코팅 1개는 비활성화
                ct_3_1.disabled = true; // 바닥타일 코팅 1개는 비활성화
            } else if (this.id === 'ct_9_2' && isChecked) {
                // 스탠다드
                ct_2_2.checked = true; // 나노코팅 2개
                ct_3_2.checked = true; // 바닥타일 코팅 2개
                ct_4_2.checked = true; // 샤워부스 안쪽 벽면 1개
                ct_2_1.disabled = true; // 나노코팅 1개는 비활성화
                ct_3_1.disabled = true; // 바닥타일 코팅 1개는 비활성화
            } else if (this.id === 'ct_9_3' && isChecked) {
                // 프리미엄
                ct_2_2.checked = true; // 나노코팅 2개
                ct_3_2.checked = true; // 바닥타일 코팅 2개
                ct_4_4.checked = true; // 욕실 벽면 전체 2개
                ct_2_1.disabled = true; // 나노코팅 1개는 비활성화
                ct_3_1.disabled = true; // 바닥타일 코팅 1개는 비활성화
                ct_4_3.disabled = true; // 욕실 벽면 전체 1개는 비활성화
                ct_4_2.disabled = true; // 샤워부스 안쪽
            }

            // 체크 해제된 경우: 패키지가 강제 체크한 항목들만 해제
            if (!isChecked) {
                if (this.id === 'ct_9_1') {
                    // 베이직
                    ct_2_2.checked = false; // 나노코팅 2개
                    ct_3_2.checked = false; // 바닥타일 코팅 2개
                    ct_2_1.disabled = false; // 나노코팅 1개는 비활성화 해제
                    ct_3_1.disabled = false; // 바닥타일 코팅 1개는 비활성화 해제
                } else if (this.id === 'ct_9_2') {
                    // 스탠다드
                    ct_2_2.checked = false; // 나노코팅 2개
                    ct_3_2.checked = false; // 바닥타일 코팅 2개
                    ct_4_2.checked = false; // 샤워부스 안쪽 벽면 1개
                    ct_2_1.disabled = false; // 나노코팅 1개는 비활성화 해제
                    ct_3_1.disabled = false; // 바닥타일 코팅 1개는 비활성화 해제
                } else if (this.id === 'ct_9_3') {
                    // 프리미엄
                    ct_2_2.checked = false; // 나노코팅 2개
                    ct_3_2.checked = false; // 바닥타일 코팅 2개
                    ct_4_4.checked = false; // 욕실 벽면 전체 2개
                    ct_2_1.disabled = false; // 나노코팅 1개는 비활성화 해제
                    ct_3_1.disabled = false; // 바닥타일 코팅 1개는 비활성화 해제
                    ct_4_3.disabled = false; // 욕실 벽면 전체 1개는 비활성화 해제
                    ct_4_2.disabled = false; // 샤워부스 안쪽은 비활성화 해제
                }
            }

            updateCoatingPrice(); // 변경 후 가격 업데이트
        });
    });

    //코팅 가격 계산
    const ctCheckboxes = document.querySelectorAll('.ct_checkbox');


    ctCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateCoatingPrice);
    });

    async function updateCoatingPrice() {

        isPackageCT1 = (ct_2_2.checked && ct_3_2.checked && !ct_4_2.checked && !ct_4_4.checked) || ct_9_1.checked; //베이직
        isPackageCT2 = (ct_2_2.checked && ct_3_2.checked && ct_4_2.checked) || ct_9_2.checked; //스탠다드
        isPackageCT3 = (ct_2_2.checked && ct_3_2.checked && ct_4_4.checked) || ct_9_3.checked; //프리미엄
        isPackageCT = isPackageCT1 || isPackageCT2 || isPackageCT3;

        let countertopTotal = 0;
        let nanoTotal = 0;
        let floorTileTotal = 0;
        let wallTileTotal = 0;
        let packagePrice = 0;

        //패키지 선택 여부
        let optionCode = null;

        if (isPackageCT2) {
            optionCode = 2;
        } else if (isPackageCT3) {
            optionCode = 3;
        } else if (isPackageCT1) {
            optionCode = 1;
        }

        // ✅ 패키지 가격 가져오기
        if (optionCode!== null) {

            try {
                const response = await fetch(`/api/get_price?service_id=CT&category_code=9&option_code=${optionCode}`);
                const data = await response.json();
                if (data.success) {
                    packagePrice = data.price;
                }
            } catch (error) {
                console.error('패키지 가격 요청 실패', error);
            }
        }


        for (const checkbox of ctCheckboxes) {
            if (checkbox.checked) {
                const parts = checkbox.id.split('_');
                const serviceId = parts[0];
                const serviceIdUpper = serviceId.toUpperCase();
                const categoryCode = parts[1];
                const optionCode = parts[2];
                console.log(serviceIdUpper, categoryCode, optionCode);

                // 패키지에 포함된 항목은 계산에서 제외
                if (isPackageCT) {
                    const isIncludedInPackage =
                        (isPackageCT1 && (checkbox.id === 'ct_2_2' || checkbox.id === 'ct_3_2')) ||
                        (isPackageCT2 && (checkbox.id === 'ct_2_2' || checkbox.id === 'ct_3_2' || checkbox.id === 'ct_4_2')) ||
                        (isPackageCT3 && (checkbox.id === 'ct_2_2' || checkbox.id === 'ct_3_2' || checkbox.id === 'ct_4_4'));

                    if (isIncludedInPackage) {
                        continue;
                    }
                }
                
                try {
                    const url = `/api/get_price?service_id=${serviceIdUpper}&category_code=${categoryCode}&option_code=${optionCode}`;
                    const response = await fetch (url);
                    console.log('요청 URL:', url);
                    const data = await response.json();
                    if (data.success) {
                        const floorCoatingSelected = checkbox.id == 'ct_3_3';
                        if (isPackageCT) {
                            const discounted = data.discounted_price ?? 0;
                            const price = discounted > 0 ? discounted : data.price;

                            if (categoryCode == '1') {
                                countertopTotal += price;
                            } else if (categoryCode == '2') {
                                nanoTotal += price;
                            } else if (categoryCode == '4') {
                                wallTileTotal += price;
                            } else if (floorCoatingSelected) {
                                floorTileTotal += price * getPyeongValue();
                            } else {
                                floorTileTotal += price;
                            }
                        } else {
                            if (categoryCode == '1') {
                                countertopTotal += data.price;
                            } else if (categoryCode == '2') {
                                nanoTotal += data.price;
                            } else if (categoryCode == '4') {
                                wallTileTotal += data.price;
                            } else if (floorCoatingSelected) {
                                floorTileTotal += data.price * getPyeongValue();
                            } else {
                                floorTileTotal += data.price;
                            }
                        }

                    }
                } catch (error) {
                    console.error(`가격 요청 실패 ${checkbox.id}`, error);
                }
            }
        }

        const coatingTotal = countertopTotal + nanoTotal + floorTileTotal + wallTileTotal + packagePrice;
        
        
        coatingPriceCountertop.textContent = countertopTotal > 0 ? `${countertopTotal.toLocaleString()}원` : '0원';
        coatingPriceNano.textContent = nanoTotal > 0 ? `${nanoTotal.toLocaleString()}원` : '0원';
        coatingPriceFloorTile.textContent = floorTileTotal > 0 ? `${floorTileTotal.toLocaleString()}원` : '0원';
        coatingPriceWallTile.textContent = wallTileTotal > 0 ? `${wallTileTotal.toLocaleString()}원` : '0원';
        coatingPriceTotal.textContent = coatingTotal > 0 ? `토탈 ${coatingTotal.toLocaleString()}원` : '0원';
        final();
    }

    
    //탄성코트
    const paintOptionSelector = document.getElementById('paintOptionSelector');
    
    //탄성코트 컨테이너 보이기
    checkPainting.addEventListener('change', function(event){
        const isChecked = event.target.checked;
        if(isChecked) {
            paintContainer.classList.remove('hide');
        } else {
            paintPrice.textContent = '';
            paintContainer.classList.add('hide');
        }
    })

    // 탄성코트 가격 표시
    paintOptionSelector.addEventListener('change', function () {
        
        const selectedValue = paintOptionSelector.value;

        if (!checkPainting.checked) {
            paintPrice.textContent = '';
            return;
        }

        if (!selectedValue) {
            paintPrice.textContent = '';
            final();
            return;
        }
        const selectedOption = paintOptionSelector.options[paintOptionSelector.selectedIndex];
        if (selectedOption && selectedOption.value !== "") {
            const parts = selectedOption.id.split('_'); 
            const serviceId = parts[0];
            const serviceIdUpper = serviceId.toUpperCase();
            const categoryCode = parts[1];    
            const optionCode = parts[2];      
            console.log(serviceIdUpper, categoryCode, optionCode);

            fetch(`/api/get_price?service_id=${serviceIdUpper}&category_code=${categoryCode}&option_code=${optionCode}`)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        paintPrice.textContent = `${data.price.toLocaleString()}원`;
                        final();
                    } else {
                        paintPrice.textContent = '가격 정보를 불러올 수 없습니다.';
                    }
                })
                .catch(err => {
                    console.error('요청 오류:', err);
                    paintPrice.textContent = '서버 오류 발생';
                });
        }

    });


    //마루코팅
    const floorCoatingOptionSelector = document.getElementById('floorCoatingOptionSelector');
    
    //마루코팅 컨테이너 보이기
    checkFloorCoating.addEventListener('change', function(event){
        const isChecked = event.target.checked;
        if(isChecked) {
            floorCoatingContainer.classList.remove('hide');
        } else {
            floorCoatingPrice.textContent = '';
            floorCoatingContainer.classList.add('hide');
        }
    })

    // 마루코팅 가격 표시
    floorCoatingOptionSelector.addEventListener('change', function () {
        const selectedOption = floorCoatingOptionSelector.options[floorCoatingOptionSelector.selectedIndex];
        const selectedValue = floorCoatingOptionSelector.value;

        if (!checkFloorCoating.checked) {
            floorCoatingPrice.textContent = '';
            return;
        }

        if (!selectedValue) {
            floorCoatingPrice.textContent = '';
            final();
            return;
        }
        if (selectedOption && selectedOption.value !== "") {
            const parts = selectedOption.id.split('_'); 
            const serviceId = parts[0].toUpperCase();
            const serviceIdUpper = serviceId.toUpperCase();
            const categoryCode = parts[1];    
            const optionCode = parts[2];      
            console.log(serviceId, categoryCode, optionCode);

            fetch(`/api/get_price?service_id=${serviceIdUpper}&category_code=${categoryCode}&option_code=${optionCode}`)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        const price = data.price * getPyeongValue();
                        floorCoatingPrice.textContent = `${price.toLocaleString()}원`;
                        final();
                    } else {
                        floorCoatingPrice.textContent = '가격 정보를 불러올 수 없습니다.';
                    }
                })
                .catch(error => {
                    console.error('가격 요청 오류:', error);
                    floorCoatingPrice.textContent = '서버 오류 발생';
                });
        } else {
            floorCoatingPrice.textContent = '구조를 선택해주세요.';
        }

    });

    //가전분해청소

    //컨테이너 보이기
    checkAppliance.addEventListener('change', function(event){
        const isChecked = event.target.checked;
        if(isChecked) {
            document.getElementById('appliances-container').classList.remove('hide');
        } else {
            airconPrice.textContent = '';
            washingmachinePrice.textContent = '';
            apPrice.textContent = '';
            document.getElementById('appliances-container').classList.add('hide');
        }
    })

    const apItems = [
        { checkboxId: 'check_ap_1_1', inputId: 'price_ap_1_1' },
        { checkboxId: 'check_ap_1_2', inputId: 'price_ap_1_2' },
        { checkboxId: 'check_ap_1_3', inputId: 'price_ap_1_3' },
        { checkboxId: 'check_ap_2_1', inputId: 'price_ap_2_1' },
        { checkboxId: 'check_ap_2_2', inputId: 'price_ap_2_2' },
        { checkboxId: 'check_ap_2_3', inputId: 'price_ap_2_3' },
    ];

    function updateApPrices() {
        let aircon = 0;
        let washingmachine = 0;

        apItems.forEach(item => {
            const checkbox = document.getElementById(item.checkboxId);
            const input = document.getElementById(item.inputId);
            const value = parseInt(input.value) || 0;

            const category_code = input.id.split('_')[2];  // '1'이면 에어컨, '2'면 세탁기

            if (checkbox.checked) {
                if (category_code === '1') {
                    aircon += value;
                } else if (category_code === '2') {
                    washingmachine += value;
                }
            }
        });

        airconPrice.textContent = `에어컨 합계: ${aircon.toLocaleString()}원`;
        washingmachinePrice.textContent = `세탁기 합계: ${washingmachine.toLocaleString()}원`;
        apPrice.textContent = `총 합계: ${(aircon + washingmachine).toLocaleString()}원`;
        final();
        
    }

    apItems.forEach(item => {
        const checkbox = document.getElementById(item.checkboxId);
        const input = document.getElementById(item.inputId);

        input.addEventListener('input', updateApPrices);

        checkbox.addEventListener('change', function () {
            input.disabled = !this.checked;
            if (!this.checked) {
                input.value = '';
            }
            updateApPrices();
        });
    });

    //가격_할인
    const discountDiv1 = document.getElementById('discount1');
    const discountDiv2 = document.getElementById('discount2');
    const discountInput = document.getElementById('discountInput');

    function final() {
        // 각 항목 가격 정수형으로 추출 (쉼표, 원 제거)
        const cleaningInt = parseInt(cleaningPriceDiv.textContent.replace(/[^0-9]/g, '')) || 0;
        const groutInt = parseInt(groutPriceTotal.textContent.replace(/[^0-9]/g, '')) || 0; // 줄눈은 updateGroutPrice에서 최종 계산됨
        const keraInt = parseInt(keraPriceTotal.textContent.replace(/[^0-9]/g, '')) || 0;
        const newhouseInt = parseInt(newhousePrice.textContent.replace(/[^0-9]/g, '')) || 0;
        const paintInt = parseInt(paintPrice.textContent.replace(/[^0-9]/g, '')) || 0;
        const floorInt = parseInt(floorCoatingPrice.textContent.replace(/[^0-9]/g, '')) || 0;
        const coatingInt = parseInt(coatingPriceTotal.textContent.replace(/[^0-9]/g, '')) || 0;
        const applianceInt = parseInt(apPrice.textContent.replace(/[^0-9]/g, '')) || 0;

        // 할인 전 금액
        const beforDiscoutPrice = cleaningInt + groutInt + keraInt + newhouseInt + paintInt + floorInt + coatingInt + applianceInt;
        let totalPrice = beforDiscoutPrice;

        // 할인 요소들 초기화
        let discount1Amount = 0;
        let discount2Amount = 0;
        let discount3Amount = parseInt(discountInput.value) || 0;

        // 청소와 함께라면 청소 + 새집증후군 선택 시 평당 1,000원 할인
        if (checkCleaning.checked && checkNewhouse.checked) {
            const pyeong = getPyeongValue();
            discount1Amount = Math.floor(pyeong) * 1000;
            discountDiv1.textContent = `할인 1번_청소와 함께라면: -${discount1Amount.toLocaleString()}원`;
        } else {
            discountDiv1.textContent = '';
        }

        let afterDiscount1 = totalPrice - discount1Amount;

        // 💸 할인 2번: 100만 원당 1% 할인 (최대 10%)
        if (afterDiscount1 >= 1000000) {
            const millionUnit = Math.floor(afterDiscount1 / 1000000);
            const discountRate = Math.min(millionUnit, 10) * 0.01;
            discount2Amount = Math.floor(afterDiscount1 * discountRate);
            discountDiv2.textContent = `할인 2번_골라담아 다다익선: -${discount2Amount.toLocaleString()}원`;
        } else {
            discount2Amount = 0;
            discountDiv2.textContent = '';
        }

        // if (discount3Amount > 0) {
        //     discount3.textContent = `할인 3번_직접입력: -${discount3Amount.toLocaleString()}원`;
        // } else {
        //     discount3.textContent = '';
        // }

        // 💸 총 할인 반영
        totalPrice -= (discount1Amount + discount2Amount + discount3Amount);

        // 결과 출력
        beforeDiscount.textContent = `할인 전 금액: ${beforDiscoutPrice.toLocaleString()}원`;
        totalPriceResultFinal.textContent = `최종 합계: ${totalPrice.toLocaleString()}원`;
    }
    discountInput.addEventListener('input', final);
});
