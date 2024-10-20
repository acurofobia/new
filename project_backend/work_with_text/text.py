import re

def replace_text_in_file(file_path):
    # Чтение текста из файла
    with open(file_path, 'r', encoding='utf-8') as file:
        text = file.read()
    
    # Замена табуляций на пробелы
    text = text.replace("\t", " ")
    
    # Замена переходов на новую строку на \n
    text = text.replace("\n", "\\n")
    text = text.replace("", "")
    
    # Замена кавычек "текст" на «текст»
    result = []
    inside_quotes = False
    for char in text:
        if char == '"':
            if inside_quotes:
                result.append('»')
            else:
                result.append('«')
            inside_quotes = not inside_quotes
        else:
            result.append(char)
    
    # Убираем повторяющиеся пробелы
    processed_text = ''.join(result)
    processed_text = re.sub(r' +', ' ', processed_text)
    
    # Возвращаем обработанный текст
    return processed_text

# Пример использования
file_path = 'text.txt'
output_text = replace_text_in_file(file_path)

# Вывод результата
print(output_text)

# Сохранение результата обратно в файл
with open('output.txt', 'w', encoding='utf-8') as output_file:
    output_file.write(output_text)