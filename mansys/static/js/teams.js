const teamData = {
    "cl_001": {
        "name": "김희연",
        "desc": "깔끔함. 투명함. 피드백이 느리다.<br> 김포 거주",
        "image": "images/portraits/청소/김희연.png"
    },
    "cl_002": {
        "name": "남동윤",
        "desc": "로이클린 팀장",
        "image": "images/portraits/청소/남동윤.png"
    },
    "cl_003": {
        "name": "손동민",
        "desc": "큰 부탁을 할 수 있다. 추가금액이 적다. A/S를 당일에 감.",
        "image": "images/portraits/청소/손동민.png"
    },
    "cl_004": {
        "name": "이정훈",
        "desc": "로이클린 팀장",
        "image": "images/portraits/청소/이정훈.png"
    },
    "cl_005": {
        "name": "조대용",
        "desc": "클린뷰 팀장",
        "image": "images/portraits/청소/조대용.png"
    },
    "cl_006": {
        "name": "조민규",
        "desc": "컴플레인 비율이 적다. 고객응대 굿",
        "image": "images/portraits/청소/조민규.png"
    },
    "cl_007": {
        "name": "정태영",
        "desc": "이천, 여주, 원주 커버 가능. 청소 퀄리티 낮은 편.",
        "image": "images/portraits/청소/정태영.png"
    },
    "cl_008": {
        "name": "조대제",
        "desc": "응대 좋음. 부산 커버",
        "image": "images/portraits/청소/조대제.png"
    },
    
    "gr_001": {
        "name": "박강일",
        "desc": "폴리우레아 원툴. 잘함. 못해도 잘해보임",
        "image": "images/portraits/줄눈/박강일.png"
    },
    "gr_002": {
        "name": "김용기",
        "desc": "정밀한 작업 스타일. 나쁘게 말하면 느림. 좋게 말하면 꼼꼼함. 줄눈 올라운더",
        "image": "images/portraits/줄눈/김용기.png"
    },
    "gr_003": {
        "name": "구자혁",
        "desc": "케라폭시 원툴, 줄눈 신기술에 진보적 성향",
        "image": "images/portraits/줄눈/구자혁.png"
    },
    "gr_004": {
        "name": "최규태",
        "desc": "설명을 매우 잘함. 보험설계사 출신.",
        "image": "images/portraits/줄눈/최규태.png"
    },

    "el_001": {
        "name": "김명군",
        "desc": "매우 가족적인 분위기. 긍정적임.",
        "image": "images/portraits/탄성/김명군.png"
    },
    "el_002": {
        "name": "미정",
        "desc": "정보 없음",
        "image": "images/default.png"
    },
    "el_003": {
        "name": "미정",
        "desc": "정보 없음",
        "image": "images/default.png"
    },
    "el_004": {
        "name": "미정",
        "desc": "정보 없음",
        "image": "images/default.png"
    },

    "co_001": {
        "name": "이재희",
        "desc": "화면빨 잘 받고 멘트 좋음",
        "image": "images/portraits/코팅/이재희.png"
    },
    "co_002": {
        "name": "황명신",
        "desc": "신규 팀장님",
        "image": "images/portraits/코팅/황명신.png"
    },
    "co_003": {
        "name": "미정",
        "desc": "정보 없음",
        "image": "images/default.png"
    },
    "co_004": {
        "name": "미정",
        "desc": "정보 없음",
        "image": "images/default.png"
    }
};

// 모든 버튼에 대해 background-image를 자동 설정
document.querySelectorAll(".btn-custom").forEach((button) => {
    const id = button.getAttribute("data-id");
    if (teamData[id]) {
        button.style.backgroundImage = `url('/static/${teamData[id].image}')`;
    }
});

// 버튼 클릭 이벤트 핸들러
let activeButton = null;

document.querySelectorAll(".btn-custom").forEach((button) => {
    button.addEventListener("click", (event) => {
        // 이전 버튼의 활성화 상태를 초기화
        if (activeButton && activeButton !== button) {
            activeButton.classList.remove("active");
        }

        // 새로 클릭된 버튼을 활성화
        const clickedButton = event.currentTarget;
        clickedButton.classList.add("active");
        activeButton = clickedButton;

        // 버튼의 상위 컨테이너(가장 가까운 .row)를 찾고 ID 가져오기
        const parentRow = clickedButton.closest(".row");
        const parentId = parentRow.id;

        // 동적으로 info-container의 ID를 추출
        const infoContainerId = parentId.replace("portrait", "info-container");
        const infoContainer = document.getElementById(infoContainerId);

        // 모든 info-container 초기화
        document.querySelectorAll("[id^='info-container']").forEach((container) => {
            container.innerHTML = "";
        });

        // 인물 정보 표시
        const id = clickedButton.getAttribute("data-id");
        if (teamData[id]) {
            const { name, desc, image } = teamData[id];
            infoContainer.innerHTML = `
                <div class="alert alert-info fade-in" role="alert">
                    <strong>${name}</strong><br>${desc}
                </div>
            `;
        } else {
            infoContainer.innerHTML = `<div class="alert alert-warning fade-in" role="alert">해당 번호에 대한 정보가 없습니다.</div>`;
        }
    });
});