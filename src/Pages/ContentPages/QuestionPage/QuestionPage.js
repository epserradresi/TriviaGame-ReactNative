import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import QuestionCard from '../../../components/cards/QuestionCard/QuestionCard';

import styles from './QuestionPage.style';

const QuestionPage = ({route, navigation}) => {
  const {questions, category: selectedCategory} = route.params;
  const [timeLeft, setTimeLeft] = useState(100);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [numCorrectAnswers, setNumCorrectAnswers] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleSelectAnswer = answer => {
    // It checks if the user's selected answer is correct and updates the numCorrectAnswer state if it is.
    const currentQuestion = questions[currentQuestionIndex];
    if (answer === currentQuestion.correct_answer) {
      setCorrectAnswers([...correctAnswers, answer]);
      setNumCorrectAnswers(numCorrectAnswers + 1);
    }
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  useEffect(() => {
    // It starts a countdown and when the time is up, the user is redirected to the results page with the number of correct answers and the quiz category.
    const timer = setInterval(() => {
      setTimeLeft(timeLeft - 1);
      if (timeLeft === 0) {
        setTimeLeft(0);
        navigation.navigate('Results', {numCorrectAnswers, selectedCategory});
      }
      return;
    }, 1000);
    return () => clearInterval(timer);
  }, [navigation, numCorrectAnswers, selectedCategory, timeLeft]);

  function handleSubmit() {
    navigation.navigate('Results', {numCorrectAnswers, selectedCategory});
  }

  const renderItem = ({item, index}) => {
    return (
      <QuestionCard
        item={item}
        question={item.question}
        correct_answer={item.correct_answer}
        incorrect_answers={item.incorrect_answers}
        questionNumber={index + 1}
        onSelectAnswer={handleSelectAnswer}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header_container}>
        <Text style={styles.category}>Category : {selectedCategory.label}</Text>
        <Text style={styles.second}>{timeLeft}</Text>
        <TouchableOpacity onPress={handleSubmit}>
          <Text style={styles.submit}>Submit</Text>
        </TouchableOpacity>
      </View>
      <View>
        <FlatList
          data={questions}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </View>
  );
};

export default QuestionPage;
