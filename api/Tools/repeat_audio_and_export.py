from pydub import AudioSegment

def repeat_audio_and_export(file_name, times, output_file):
    # Load the file
    audio = AudioSegment.from_file(file_name)

    # Repeat the audio the specified number of times
    combined = audio * times

    # Export the combined audio
    combined.export(output_file, format="mp3")

# Example usage
repeat_audio_and_export("/Users/icer/Documents/GitHub/Wisdom/api/Tools/a.mp3", 4, "./b.mp3")
