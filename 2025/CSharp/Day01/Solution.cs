namespace AdventOfCode2025.Day01;

public class Solution : SolutionBase
{
  public override int Day => 1;
  private const int MaximumDialStep = 99;

  public Solution(bool exampleMode) : base(exampleMode)
  {
  }

  protected override void PerformPartOne()
  {
    var stepResults = PerformInstructions();
    var countOfZeros = stepResults.Count(result => result.ResultingPosition == 0);
    Console.WriteLine("There were {0} zeros at ending position", countOfZeros);
  }

  protected override void PerformPartTwo()
  {
    var stepResults = PerformInstructions();
    var countOfZeros = stepResults.Sum(result => result.ZerosEncountered);
    Console.WriteLine("There were {0} zeros encountered", countOfZeros);
  }

  private List<StepResult> PerformInstructions()
  {
    var currentPosition = 50;
    var stepResults = new List<StepResult>();

    var instructions = GetInput();

    foreach (var instruction in instructions)
    {
      var stepResult = PerformOneInstruction(ref currentPosition, instruction);
      Console.WriteLine(stepResult.ToString());
      stepResults.Add(stepResult);
    }

    return stepResults;
  }

  private StepResult PerformOneInstruction(ref int currentPosition, string instruction)
  {
    var direction = ParseDirection(instruction);
    var numberOfTurns = ParseTurnCount(instruction);

    var zerosEncountered = 0;

    for (var i = 0; i < numberOfTurns; i += 1)
    {
      switch (direction)
      {
        case Direction.Left:
          currentPosition -= 1;
          if (currentPosition < 0)
          {
            currentPosition = MaximumDialStep;
          }
          break;
        case Direction.Right:
          currentPosition += 1;
          if (currentPosition > MaximumDialStep)
          {
            currentPosition = 0;
          }
          break;
      }

      if (currentPosition == 0)
      {
        zerosEncountered += 1;
      }
    }

    var stepResult = new StepResult
    {
      Movement = instruction,
      ResultingPosition = currentPosition,
      ZerosEncountered = zerosEncountered
    };

    return stepResult;
  }

  private List<string> GetInput()
  {
    return ReadFileLines(ExampleMode ? "example.txt" : "input.txt");
  }

  private Direction ParseDirection(string instruction)
  {
    switch (instruction[0])
    {
      case 'L':
        return Direction.Left;
      case 'R':
        return Direction.Right;
      default:
        throw new ArgumentException("Invalid direction");
    }
  }

  private int ParseTurnCount(string instruction)
  {
    return int.Parse(instruction.Substring(1));
  }

  enum Direction
  {
    Left,
    Right
  }

  class StepResult
  {
    public required string Movement { get; set; }

    public required int ResultingPosition { get; set; }

    public required int ZerosEncountered { get; set; }

    public override string ToString()
    {
      return $"{Movement}: {ResultingPosition}";
    }
  }
}
