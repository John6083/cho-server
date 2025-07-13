import React, { useState, useEffect, useCallback } from 'react';

// Confirmation Dialog Component
const ConfirmDialog = ({ message, onConfirm, onCancel }) => {
  const [checkedDoNotShowAgain, setCheckedDoNotShowAgain] = useState(false);

  const handleConfirm = () => {
    onConfirm(checkedDoNotShowAgain); // Pass the checkbox state
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full mx-4">
        <p className="text-lg font-semibold mb-4 text-center">{message}</p>
        <div className="flex justify-around space-x-4">
          <button
            onClick={handleConfirm}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105"
          >
            확인
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105"
          >
            취소
          </button>
        </div>
        <div className="mt-4 flex items-center justify-center">
          <input
            type="checkbox"
            id="doNotShowAgain"
            className="form-checkbox h-4 w-4 text-blue-600 rounded"
            checked={checkedDoNotShowAgain}
            onChange={(e) => setCheckedDoNotShowAgain(e.target.checked)}
          />
          <label htmlFor="doNotShowAgain" className="ml-2 text-sm text-gray-700">다시 보지 않기</label>
        </div>
      </div>
    </div>
  );
};

// Batch Input Modal Component
const BatchInputModal = ({ subjects, currentGrades, onSave, onClose, onGradeChange }) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-xl shadow-2xl max-w-lg w-full mx-4">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">과목별 성적 일괄 입력</h2>
      <div className="max-h-80 overflow-y-auto mb-4 border border-gray-200 rounded-lg p-2">
        {subjects.length === 0 ? (
          <p className="text-center text-gray-500 py-4">과목을 추가해주세요.</p>
        ) : (
          subjects.map(subject => (
            <div key={subject.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <span className="text-gray-700 font-medium w-3/5 truncate">{subject.name || '새 과목'}</span>
              <input
                type="number"
                min="1"
                max="9"
                value={currentGrades[subject.id] || ''}
                onChange={(e) => onGradeChange(subject.id, e.target.value)}
                className="w-1/4 p-2 border border-gray-300 rounded-lg text-center focus:ring-blue-500 focus:border-blue-500"
                placeholder="등급"
              />
            </div>
          ))
        )}
      </div>
      <div className="flex justify-end space-x-4">
        <button
          onClick={onSave}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105"
        >
          저장
        </button>
        <button
          onClick={onClose}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105"
        >
          닫기
        </button>
      </div>
    </div>
  </div>
);


// Main App component
const App = () => {
  // Function to create default subjects for a detailed 1st-year semester
  const create1stYearDefaultSubjects = () => [
    { id: Date.now() + 1, name: '국어', credits: 4, grade: '' },
    { id: Date.now() + 2, name: '수학', credits: 4, grade: '' },
    { id: Date.now() + 3, name: '영어', credits: 4, grade: '' },
    { id: Date.now() + 4, name: '한국사', credits: 3, grade: '' },
    { id: Date.now() + 5, name: '통합사회', credits: 3, grade: '' },
    { id: Date.now() + 6, name: '통합과학', credits: 3, grade: '' },
    { id: Date.now() + 7, name: '생활과 한문', credits: 1, grade: '' },
    { id: Date.now() + 8, name: '기술가정/정보', credits: 2, grade: '' },
  ];

  // Function to create default subjects for a detailed 2nd-year semester
  const create2ndYearDefaultSubjects = () => [
    { id: Date.now() + 10, name: '국어', credits: 4, grade: '' },
    { id: Date.now() + 11, name: '수학', credits: 4, grade: '' },
    { id: Date.now() + 12, name: '확률과 통계', credits: 2, grade: '' },
    { id: Date.now() + 13, name: '영어', credits: 4, grade: '' },
    { id: Date.now() + 14, name: '탐구1', credits: 3, grade: '' },
    { id: Date.now() + 15, name: '탐구2', credits: 3, grade: '' },
    { id: Date.now() + 16, name: '탐구3', credits: 3, grade: '' },
    { id: Date.now() + 17, name: '제2외국어', credits: 2, grade: '' },
  ];

  // Function to create default subjects for a detailed 3rd-year semester
  const create3rdYearDefaultSubjects = () => [
    { id: Date.now() + 20, name: '국어', credits: 3, grade: '' },
    { id: Date.now() + 21, name: '영어', credits: 3, grade: '' },
    { id: Date.now() + 22, name: '수학', credits: 3, grade: '' },
  ];

  // State to store semesters data, including mode and subjects/manual GPA
  const [semesters, setSemesters] = useState(() => {
    try {
      const savedSemesters = localStorage.getItem('gradeCalculatorSemesters');
      if (savedSemesters) {
        const parsedSemesters = JSON.parse(savedSemesters);
        // Ensure backward compatibility: if old structure, convert to new structure
        const newSemesters = {};
        for (const key in parsedSemesters) {
          if (Array.isArray(parsedSemesters[key])) { // Old structure (just subjects array)
            newSemesters[key] = {
              mode: 'detailed',
              subjects: parsedSemesters[key],
              manualGPA: '',
              manualTotalCredits: ''
            };
          } else { // New structure or already converted
            newSemesters[key] = parsedSemesters[key];
          }
        }
        return newSemesters;
      } else {
        // If no saved data, initialize with default subjects for all semesters in 'detailed' mode
        return {
          '1-1': { mode: 'detailed', subjects: create1stYearDefaultSubjects(), manualGPA: '', manualTotalCredits: '' },
          '1-2': { mode: 'detailed', subjects: create1stYearDefaultSubjects(), manualGPA: '', manualTotalCredits: '' },
          '2-1': { mode: 'detailed', subjects: create2ndYearDefaultSubjects(), manualGPA: '', manualTotalCredits: '' },
          '2-2': { mode: 'detailed', subjects: create2ndYearDefaultSubjects(), manualGPA: '', manualTotalCredits: '' },
          '3-1': { mode: 'detailed', subjects: create3rdYearDefaultSubjects(), manualGPA: '', manualTotalCredits: '' }, // 3학년 1학기 기본 과목 설정
        };
      }
    } catch (error) {
      console.error("Failed to load semesters from localStorage:", error);
      // Fallback to default subjects if localStorage fails or data is corrupted
      return {
        '1-1': { mode: 'detailed', subjects: create1stYearDefaultSubjects(), manualGPA: '', manualTotalCredits: '' },
        '1-2': { mode: 'detailed', subjects: create1stYearDefaultSubjects(), manualGPA: '', manualTotalCredits: '' },
        '2-1': { mode: 'detailed', subjects: create2ndYearDefaultSubjects(), manualGPA: '', manualTotalCredits: '' },
        '2-2': { mode: 'detailed', subjects: create2ndYearDefaultSubjects(), manualGPA: '', manualTotalCredits: '' },
        '3-1': { mode: 'detailed', subjects: create3rdYearDefaultSubjects(), manualGPA: '', manualTotalCredits: '' },
      };
    }
  });

  // State for the currently active semester tab
  const [activeSemester, setActiveSemester] = useState('1-1');
  // State to hold subjects copied for pasting
  const [copiedSubjects, setCopiedSubjects] = useState(null); // Changed to null to store the whole semester object
  // State for showing batch input modal (for detailed mode)
  const [showBatchInput, setShowBatchInput] = useState(false);
  // State for batch input values
  const [batchGrades, setBatchGrades] = useState({});
  // State for showing confirmation dialog
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmAction, setConfirmAction] = useState(null);
  // State to manage selected subject IDs for deletion (for detailed mode)
  const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);
  // New state to control whether to show the mode change confirmation dialog
  const [doNotShowModeChangeConfirm, setDoNotShowModeChangeConfirm] = useState(false);

  // Save semesters to localStorage whenever they change (auto-save current state)
  useEffect(() => {
    try {
      localStorage.setItem('gradeCalculatorSemesters', JSON.stringify(semesters));
    } catch (error) {
      console.error("Failed to save semesters to localStorage:", error);
    }
  }, [semesters]);

  // Clear selected subject IDs when semester changes
  useEffect(() => {
    setSelectedSubjectIds([]);
  }, [activeSemester]);

  // Function to add a new subject to the active semester (only in detailed mode)
  const addSubject = useCallback(() => {
    setSemesters(prevSemesters => ({
      ...prevSemesters,
      [activeSemester]: {
        ...prevSemesters[activeSemester],
        subjects: [
          ...prevSemesters[activeSemester].subjects,
          { id: Date.now(), name: '', credits: 3, grade: '' } // Default credits to 3
        ],
      },
    }));
  }, [activeSemester]);

  // Function to update a subject's details (only in detailed mode)
  const updateSubject = useCallback((id, field, value) => {
    setSemesters(prevSemesters => ({
      ...prevSemesters,
      [activeSemester]: {
        ...prevSemesters[activeSemester],
        subjects: prevSemesters[activeSemester].subjects.map(subject =>
          subject.id === id ? { ...subject, [field]: value } : subject
        ),
      },
    }));
  }, [activeSemester]);

  // Function to toggle selection of a subject (only in detailed mode)
  const toggleSubjectSelection = useCallback((id) => {
    setSelectedSubjectIds(prevSelected =>
      prevSelected.includes(id)
        ? prevSelected.filter(subjectId => subjectId !== id)
        : [...prevSelected, id]
    );
  }, []);

  // Function to toggle selection of all subjects in the current semester (only in detailed mode)
  const toggleSelectAllSubjects = useCallback(() => {
    const currentSemesterSubjects = semesters[activeSemester].subjects;
    if (currentSemesterSubjects.length > 0 && selectedSubjectIds.length === currentSemesterSubjects.length) {
      setSelectedSubjectIds([]); // Deselect all
    } else {
      setSelectedSubjectIds(currentSemesterSubjects.map(subject => subject.id)); // Select all
    }
  }, [activeSemester, semesters, selectedSubjectIds.length]);

  // Function to delete selected subjects (only in detailed mode)
  const deleteSelectedSubjects = useCallback(() => {
    if (selectedSubjectIds.length === 0) {
      const messageElement = document.createElement('div');
      messageElement.textContent = '선택된 과목이 없습니다.';
      messageElement.className = 'fixed bottom-5 right-5 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      document.body.appendChild(messageElement);
      setTimeout(() => {
        messageElement.remove();
      }, 2000);
      return;
    }

    setConfirmMessage(`${selectedSubjectIds.length}개의 과목을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`);
    setConfirmAction(() => () => {
      setSemesters(prevSemesters => ({
        ...prevSemesters,
        [activeSemester]: {
          ...prevSemesters[activeSemester],
          subjects: prevSemesters[activeSemester].subjects.filter(
            subject => !selectedSubjectIds.includes(subject.id)
          ),
        },
      }));
      setSelectedSubjectIds([]); // Clear selection after deletion
      setShowConfirmDialog(false);
    });
    setShowConfirmDialog(true);
  }, [activeSemester, selectedSubjectIds]);

  // Function to calculate the GPA for a given semester (handles both modes)
  const calculateGPA = useCallback((semesterData) => {
    if (semesterData.mode === 'manual') {
      const manualGPA = parseFloat(semesterData.manualGPA);
      return !isNaN(manualGPA) ? manualGPA.toFixed(2) : '0.00';
    } else { // mode === 'detailed'
      let totalCredits = 0;
      let totalWeightedGrade = 0;

      semesterData.subjects.forEach(subject => {
        const credits = parseFloat(subject.credits);
        const grade = parseFloat(subject.grade);

        // Only include valid numbers for calculation
        if (!isNaN(credits) && credits > 0 && !isNaN(grade) && grade >= 1 && grade <= 9) {
          totalCredits += credits;
          totalWeightedGrade += credits * grade;
        }
      });

      return totalCredits > 0 ? (totalWeightedGrade / totalCredits).toFixed(2) : '0.00';
    }
  }, []);

  // Function to calculate total credits for a given semester (handles both modes)
  const getTotalCredits = useCallback((semesterData) => {
    if (semesterData.mode === 'manual') {
      const manualCredits = parseFloat(semesterData.manualTotalCredits);
      return !isNaN(manualCredits) ? manualCredits : 0;
    } else { // mode === 'detailed'
      return semesterData.subjects.reduce((sum, subject) => {
        const credits = parseFloat(subject.credits);
        return sum + (!isNaN(credits) && credits > 0 ? credits : 0);
      }, 0);
    }
  }, []);

  // Function to copy subjects/semester data from the active semester
  const copySubjects = useCallback(() => {
    setCopiedSubjects({ ...semesters[activeSemester] }); // Copy the entire semester object
    const messageElement = document.createElement('div');
    messageElement.textContent = '학기 정보가 복사되었습니다!';
    messageElement.className = 'fixed bottom-5 right-5 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    document.body.appendChild(messageElement);
    setTimeout(() => {
      messageElement.remove();
    }, 2000);
  }, [activeSemester, semesters]);

  // Function to paste copied subjects/semester data to the active semester
  const pasteSubjects = useCallback(() => {
    if (!copiedSubjects) {
      const messageElement = document.createElement('div');
      messageElement.textContent = '복사된 학기 정보가 없습니다.';
      messageElement.className = 'fixed bottom-5 right-5 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      document.body.appendChild(messageElement);
      setTimeout(() => {
        messageElement.remove();
      }, 2000);
      return;
    }

    setConfirmMessage('현재 학기의 모든 과목/점수 정보를 복사된 정보로 덮어쓰시겠습니까?');
    setConfirmAction(() => () => {
      const newSemesterData = { ...copiedSubjects };
      // If copying detailed subjects, ensure new IDs for subjects
      if (newSemesterData.mode === 'detailed') {
        newSemesterData.subjects = newSemesterData.subjects.map(subject => ({ ...subject, id: Date.now() + Math.random() }));
      }
      setSemesters(prevSemesters => ({
        ...prevSemesters,
        [activeSemester]: newSemesterData,
      }));
      setShowConfirmDialog(false);
    });
    setShowConfirmDialog(true);
  }, [activeSemester, copiedSubjects]);

  // Function to open batch input modal (only for detailed mode)
  const openBatchInput = useCallback(() => {
    if (semesters[activeSemester].mode === 'manual') {
      const messageElement = document.createElement('div');
      messageElement.textContent = '현재 학기는 "학기 점수 직접 입력" 모드입니다. 과목별 성적 일괄 입력은 "상세 입력" 모드에서만 가능합니다.';
      messageElement.className = 'fixed bottom-5 right-5 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      document.body.appendChild(messageElement);
      setTimeout(() => {
        messageElement.remove();
      }, 4000);
      return;
    }
    const currentGrades = {};
    semesters[activeSemester].subjects.forEach(subject => {
      currentGrades[subject.id] = subject.grade;
    });
    setBatchGrades(currentGrades);
    setShowBatchInput(true);
  }, [activeSemester, semesters]);

  // Function to save batch input grades (only for detailed mode)
  const saveBatchGrades = useCallback(() => {
    setSemesters(prevSemesters => ({
      ...prevSemesters,
      [activeSemester]: {
        ...prevSemesters[activeSemester],
        subjects: prevSemesters[activeSemester].subjects.map(subject => ({
          ...subject,
          grade: batchGrades[subject.id] || subject.grade, // Use batch grade if available, otherwise keep existing
        })),
      },
    }));
    setShowBatchInput(false);
  }, [activeSemester, batchGrades]);

  // Function to clear all subjects for the active semester (resets to default detailed mode)
  const clearSemesterSubjects = useCallback(() => {
    setConfirmMessage('현재 학기의 모든 과목/점수 정보를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.');
    setConfirmAction(() => () => {
      setSemesters(prevSemesters => ({
        ...prevSemesters,
        [activeSemester]: { mode: 'detailed', subjects: [], manualGPA: '', manualTotalCredits: '' }, // Reset to empty detailed
      }));
      setShowConfirmDialog(false);
    });
    setShowConfirmDialog(true);
  }, [activeSemester]);

  // Function to update manual GPA/Credits
  const updateManualInput = useCallback((field, value) => {
    setSemesters(prevSemesters => ({
      ...prevSemesters,
      [activeSemester]: {
        ...prevSemesters[activeSemester],
        [field]: value
      }
    }));
  }, [activeSemester]);

  // Function to toggle semester input mode
  const toggleSemesterMode = useCallback((mode) => {
    // If user has opted not to see the confirmation, proceed directly
    if (doNotShowModeChangeConfirm) {
      setSemesters(prevSemesters => ({
        ...prevSemesters,
        [activeSemester]: {
          ...prevSemesters[activeSemester],
          mode: mode,
        },
      }));
      return; // Exit early
    }

    setConfirmMessage(`현재 학기 입력 방식을 "${mode === 'detailed' ? '상세 입력' : '학기 점수 직접 입력'}"으로 변경하시겠습니까? 기존 정보는 유지됩니다.`);
    setConfirmAction(() => (shouldNotShowAgain) => { // Modified to accept shouldNotShowAgain
      if (shouldNotShowAgain) {
        setDoNotShowModeChangeConfirm(true); // Set the global state
      }
      setSemesters(prevSemesters => ({
        ...prevSemesters,
        [activeSemester]: {
          ...prevSemesters[activeSemester],
          mode: mode,
        },
      }));
      setShowConfirmDialog(false);
    });
    setShowConfirmDialog(true);
  }, [activeSemester, doNotShowModeChangeConfirm]);

  // Calculate overall GPA and total credits for overall calculation
  const calculateOverallGPA = useCallback(() => {
    let overallTotalCredits = 0;
    let overallTotalWeightedGrade = 0;

    Object.values(semesters).forEach(semesterData => {
      if (semesterData.mode === 'manual') {
        const manualGPA = parseFloat(semesterData.manualGPA);
        const manualCredits = parseFloat(semesterData.manualTotalCredits);
        if (!isNaN(manualGPA) && !isNaN(manualCredits) && manualCredits > 0) {
          overallTotalCredits += manualCredits;
          overallTotalWeightedGrade += manualGPA * manualCredits;
        }
      } else { // detailed mode
        semesterData.subjects.forEach(subject => {
          const credits = parseFloat(subject.credits);
          const grade = parseFloat(subject.grade);
          if (!isNaN(credits) && credits > 0 && !isNaN(grade) && grade >= 1 && grade <= 9) {
            overallTotalCredits += credits;
            overallTotalWeightedGrade += credits * grade;
          }
        });
      }
    });

    return overallTotalCredits > 0 ? (overallTotalWeightedGrade / overallTotalCredits).toFixed(2) : '0.00';
  }, [semesters]);

  const currentSemesterData = semesters[activeSemester];
  const allSubjectsSelected = currentSemesterData.mode === 'detailed' &&
                              currentSemesterData.subjects.length > 0 &&
                              selectedSubjectIds.length === currentSemesterData.subjects.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 font-inter text-gray-800 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-indigo-700 drop-shadow-md">
        내신산출 프로그램
      </h1>

      {/* Semester Tabs */}
      <div className="w-full max-w-4xl bg-white rounded-t-xl shadow-lg overflow-hidden">
        <div className="flex justify-center bg-indigo-600 p-2 rounded-t-xl">
          {Object.keys(semesters).map(semesterKey => (
            <button
              key={semesterKey}
              onClick={() => setActiveSemester(semesterKey)}
              className={`px-6 py-3 text-lg font-semibold rounded-lg transition-all duration-300 ease-in-out
                ${activeSemester === semesterKey
                  ? 'bg-white text-indigo-700 shadow-md transform scale-105'
                  : 'text-indigo-200 hover:bg-indigo-700 hover:text-white'
                } mx-1`}
            >
              {semesterKey.replace('1-', '1학년 ').replace('2-', '2학년 ').replace('3-', '3학년 ') + '학기'}
            </button>
          ))}
        </div>

        {/* Semester Content */}
        <div className="p-6 bg-white rounded-b-xl shadow-inner">
          <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600">
            {activeSemester.replace('1-', '1학년 ').replace('2-', '2학년 ').replace('3-', '3학년 ') + '학기'}
          </h2>

          {/* Mode Toggle */}
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => toggleSemesterMode('detailed')}
              className={`px-5 py-2 rounded-full font-semibold transition-all duration-300
                ${currentSemesterData.mode === 'detailed'
                  ? 'bg-indigo-500 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              상세 입력
            </button>
            <button
              onClick={() => toggleSemesterMode('manual')}
              className={`px-5 py-2 rounded-full font-semibold transition-all duration-300
                ${currentSemesterData.mode === 'manual'
                  ? 'bg-indigo-500 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              학기 점수 직접 입력
            </button>
          </div>

          {currentSemesterData.mode === 'detailed' ? (
            <>
              {/* Subject List Header */}
              <div className="grid grid-cols-5 gap-4 text-sm font-bold text-gray-600 mb-3 pb-2 border-b-2 border-gray-200 items-center">
                <div className="flex items-center justify-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-blue-600 rounded"
                    checked={allSubjectsSelected}
                    onChange={toggleSelectAllSubjects}
                  />
                </div>
                <div className="col-span-2">과목명</div>
                <div>단위수</div>
                <div>등급</div>
              </div>

              {/* Subject List */}
              {currentSemesterData.subjects.length === 0 ? (
                <p className="text-center text-gray-500 py-8 text-lg">
                  아직 등록된 과목이 없습니다. 아래 '과목 추가' 버튼을 눌러주세요.
                </p>
              ) : (
                currentSemesterData.subjects.map(subject => (
                  <div key={subject.id} className="grid grid-cols-5 gap-4 items-center mb-3 p-2 bg-gray-50 rounded-lg shadow-sm">
                    <div className="flex items-center justify-center">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-blue-600 rounded"
                        checked={selectedSubjectIds.includes(subject.id)}
                        onChange={() => toggleSubjectSelection(subject.id)}
                      />
                    </div>
                    <input
                      type="text"
                      value={subject.name}
                      onChange={(e) => updateSubject(subject.id, 'name', e.target.value)}
                      placeholder="과목명"
                      className="col-span-2 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                    />
                    <input
                      type="number"
                      min="1"
                      value={subject.credits}
                      onChange={(e) => updateSubject(subject.id, 'credits', parseInt(e.target.value) || '')}
                      placeholder="단위수"
                      className="p-2 border border-gray-300 rounded-lg text-center focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                    />
                    <input
                      type="number"
                      min="1"
                      max="9"
                      value={subject.grade}
                      onChange={(e) => updateSubject(subject.id, 'grade', parseInt(e.target.value) || '')}
                      placeholder="등급 (1-9)"
                      className="p-2 border border-gray-300 rounded-lg text-center focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                    />
                  </div>
                ))
              )}
            </>
          ) : (
            <div className="flex flex-col items-center gap-4 py-8">
              {(activeSemester === '1-1' || activeSemester === '1-2') && (
                <p className="text-sm text-gray-600 text-center mb-2">
                  무원고 1학년 전과목 단위수는 24, 기술가정/정보 및 생활과 한문 제외 단위수는 21입니다.
                </p>
              )}
              {(activeSemester === '2-1' || activeSemester === '2-2') && (
                <p className="text-sm text-gray-600 text-center mb-2">
                  2학년 전과목 단위수는 25, 제2외국어 제외 단위수는 23입니다.
                </p>
              )}
              {activeSemester === '3-1' && (
                <p className="text-sm text-gray-600 text-center mb-2">
                  영어 독해와 작문, 미적분, 국어 교과 과목 선택 시 무원고의 3학년 1학기 단위수는 9입니다.
                </p>
              )}
              <div className="w-full max-w-xs">
                <label htmlFor="manualTotalCredits" className="block text-gray-700 text-sm font-bold mb-2">
                  총 단위수:
                </label>
                <input
                  type="number"
                  id="manualTotalCredits"
                  min="0"
                  value={currentSemesterData.manualTotalCredits}
                  onChange={(e) => updateManualInput('manualTotalCredits', e.target.value)}
                  placeholder="총 단위수"
                  className="w-full p-3 border border-gray-300 rounded-lg text-center text-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                />
              </div>
              <div className="w-full max-w-xs">
                <label htmlFor="manualGPA" className="block text-gray-700 text-sm font-bold mb-2">
                  내신 점수 (평균 등급):
                </label>
                <input
                  type="number"
                  id="manualGPA"
                  step="0.01"
                  min="1"
                  max="9"
                  value={currentSemesterData.manualGPA}
                  onChange={(e) => updateManualInput('manualGPA', e.target.value)}
                  placeholder="내신 점수 (1.00 - 9.00)"
                  className="w-full p-3 border border-gray-300 rounded-lg text-center text-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                />
              </div>
            </div>
          )}

          {/* Semester Actions */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {currentSemesterData.mode === 'detailed' && (
              <>
                <button
                  onClick={addSubject}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 shadow-lg flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path></svg>
                  과목 추가
                </button>
                <button
                  onClick={deleteSelectedSubjects}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 shadow-lg flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd"></path></svg>
                  선택된 과목 삭제
                </button>
                <button
                  onClick={openBatchInput}
                  className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 shadow-lg flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 000-2H7zm3 0a1 1 0 000 2h.01a1 1 0 000-2H10zm3 0a1 1 0 000 2h.01a1 1 0 000-2H13zm-3 4a1 1 0 000 2h.01a1 1 0 000-2H10zm3 0a1 1 0 000 2h.01a1 1 0 000-2H13z" clipRule="evenodd"></path></svg>
                  과목별 성적 일괄 입력
                </button>
              </>
            )}
            <button
              onClick={copySubjects}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 shadow-lg flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"></path><path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"></path></svg>
              학기 정보 복사
            </button>
            <button
              onClick={pasteSubjects}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 shadow-lg flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V3a1 1 0 011-1z" clipRule="evenodd"></path></svg>
              학기 정보 붙여넣기
            </button>
            <button
              onClick={clearSemesterSubjects}
              className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 shadow-lg flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd"></path></svg>
              학기 과목 전체 삭제
            </button>
          </div>

          {/* GPA Result */}
          <div className="mt-8 p-4 bg-indigo-100 rounded-xl shadow-inner text-center">
            <p className="text-xl font-semibold text-indigo-700">
              {activeSemester.replace('1-', '1학년 ').replace('2-', '2학년 ').replace('3-', '3학년 ') + '학기 내신 점수:'}
            </p>
            <p className="text-5xl font-extrabold text-indigo-800 mt-2">
              {calculateGPA(currentSemesterData)}
            </p>
          </div>
        </div>
      </div>

      {/* Overall GPA */}
      <div className="w-full max-w-4xl mt-8 p-6 bg-white rounded-xl shadow-lg text-center border-t-4 border-indigo-500">
        <h2 className="text-3xl font-bold text-indigo-700 mb-4">전체 내신 점수</h2>
        <p className="text-5xl font-extrabold text-indigo-800">
          {calculateOverallGPA()}
        </p>
      </div>

      {showBatchInput && (
        <BatchInputModal
          subjects={currentSemesterData.subjects}
          currentGrades={batchGrades}
          onSave={saveBatchGrades}
          onClose={() => setShowBatchInput(false)}
          onGradeChange={(id, value) => setBatchGrades(prev => ({ ...prev, [id]: value }))}
        />
      )}

      {showConfirmDialog && (
        <ConfirmDialog
          message={confirmMessage}
          onConfirm={confirmAction}
          onCancel={() => setShowConfirmDialog(false)}
        />
      )}
    </div>
  );
};

export default App;
